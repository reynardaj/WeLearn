// app/api/tutor-dashboard/performances/weeks/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { Pool } from 'pg';

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false },
});

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const tutorId = searchParams.get('tutorId');
  const currentDate = new Date().toISOString(); // For determining the current month

  if (!tutorId) {
    return NextResponse.json({ message: 'tutorId query parameter is required' }, { status: 400 });
  }

  const client = await pool.connect();

  try {
    const weeklySessionsQuery = `
      WITH weeks_starting_in_current_month AS (
        -- 1. Generate all Mondays that start within the current month
        SELECT
          generated_monday::date AS week_start_day
        FROM (
          SELECT DISTINCT date_trunc('week', series_day)::date as generated_monday
          FROM generate_series(
            date_trunc('month', $2::date), -- First day of current month
            date_trunc('month', $2::date) + interval '1 month' - interval '1 day', -- Last day of current month
            '1 day'::interval
          ) AS series_day
        ) mondays_in_month
        WHERE date_trunc('month', mondays_in_month.generated_monday) = date_trunc('month', $2::date) 
           OR mondays_in_month.generated_monday = date_trunc('month', $2::date) -- Include week if month starts mid-week but Monday is last month
           OR ( -- Include week if first Monday is in previous month but week contains first of current month
                EXTRACT(MONTH FROM mondays_in_month.generated_monday) = EXTRACT(MONTH FROM date_trunc('month', $2::date) - interval '1 month') AND
                EXTRACT(YEAR FROM mondays_in_month.generated_monday) = EXTRACT(YEAR FROM date_trunc('month', $2::date) - interval '1 month') AND
                mondays_in_month.generated_monday + interval '6 days' >= date_trunc('month', $2::date)
              )
        ORDER BY week_start_day
      ),
      -- Refined CTE to ensure all weeks touching the month are considered for display, then label them
      month_display_weeks AS (
        SELECT
          wsd.week_start_day,
          TO_CHAR(wsd.week_start_day, 'Mon DD') || ' - ' || TO_CHAR(wsd.week_start_day + '6 days'::interval, 'Mon DD') AS name,
          ROW_NUMBER() OVER (ORDER BY wsd.week_start_day) as week_label_num -- For "Week X" if still desired, or just for ordering
        FROM (
            SELECT DISTINCT date_trunc('week', series_day)::date AS week_start_day
            FROM generate_series(
                date_trunc('month', $2::date),
                date_trunc('month', $2::date) + interval '1 month' - interval '1 day',
                '1 day'::interval
            ) AS series_day
        ) wsd
      ),
      actual_weekly_sessions AS (
        -- 2. Get actual session counts, grouped by the week they started in
        SELECT
          date_trunc('week', b."StartTime")::date AS week_start_day_of_session,
          COUNT(*) AS sessions_count
        FROM booking b
        WHERE b."tutorID" = $1
          -- Count sessions that occurred in the current month
          AND date_trunc('month', b."StartTime") = date_trunc('month', $2::date)
        GROUP BY 1
      )
      -- 3. Left join all display weeks with actual sessions for that week
      SELECT
        mdw.name, -- Use the formatted date range as the name
        COALESCE(aws.sessions_count, 0) AS sessions
      FROM month_display_weeks mdw
      LEFT JOIN actual_weekly_sessions aws ON mdw.week_start_day = aws.week_start_day_of_session
      ORDER BY mdw.week_start_day ASC;
    `;
    // Note: The 'month_display_weeks' CTE generates distinct Mondays for weeks that have any day in the current month.
    // This should result in 5 or 6 rows for most months, accurately reflecting the span.

    const result = await client.query(weeklySessionsQuery, [tutorId, currentDate]);

    const chartData = result.rows.map(row => ({
      name: row.name, // This will now be "May 26 - Jun 01", etc.
      sessions: parseInt(row.sessions, 10)
    }));

    return NextResponse.json(chartData, { status: 200 });

  } catch (error) {
    console.error('Error fetching weekly sessions for current month:', error);
    let errorMessage = 'An unknown error occurred';
    if (error instanceof Error) errorMessage = error.message;
    return NextResponse.json({ message: 'Error fetching weekly sessions', error: errorMessage }, { status: 500 });
  } finally {
    client.release();
  }
}