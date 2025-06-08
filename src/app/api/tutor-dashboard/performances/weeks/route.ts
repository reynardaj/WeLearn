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
  const startDateParam = searchParams.get('startDate');
  const endDateParam = searchParams.get('endDate');

  if (!tutorId) {
    return NextResponse.json({ message: 'tutorId query parameter is required' }, { status: 400 });
  }

  if (startDateParam && endDateParam && new Date(endDateParam) < new Date(startDateParam)) {
    return NextResponse.json({ message: 'endDate cannot be before startDate' }, { status: 400 });
  }

  const client = await pool.connect();

  try {
    const finalQueryParams: string[] = [tutorId];
    let seriesStart: string;
    let seriesEnd: string;
    let paramIndex = 2;

    if (startDateParam && endDateParam) {
      // Logic for when a custom date range IS provided
      seriesStart = `$${paramIndex++}`;
      finalQueryParams.push(startDateParam);
      seriesEnd = `$${paramIndex++}`;
      finalQueryParams.push(endDateParam);
    } else {
      // **NEW: Default logic for when NO date range is provided**
      // Default to the start and end of the current month
      seriesStart = `date_trunc('month', NOW()::date)`;
      seriesEnd = `(date_trunc('month', NOW()::date) + interval '1 month' - interval '1 day')`;
    }

    const weeklySessionsQuery = `
      WITH date_range_weeks AS (
        -- 1. Generate a series of all Mondays that fall within the given date range
        SELECT DISTINCT
          date_trunc('week', series_day)::date AS week_start_day
        FROM generate_series(
          ${seriesStart}::date,
          ${seriesEnd}::date,
          '1 day'::interval
        ) AS series_day
      ),
      actual_weekly_sessions AS (
        -- 2. Get actual session counts, grouped by the week they started in
        SELECT
          date_trunc('week', b."StartTime")::date AS week_start_day_of_session,
          COUNT(*) AS sessions_count
        FROM booking b
        WHERE b."tutorID" = $1
          AND b."StartTime" >= (${seriesStart})::date
          AND b."StartTime" < (${seriesEnd}::date + '1 day'::interval)
        GROUP BY 1
      )
      -- 3. Left join all weeks in the range with actual sessions for that week
      SELECT
        -- Format the name to show the week's date range
        TO_CHAR(drw.week_start_day, 'Mon DD') || ' - ' || TO_CHAR(drw.week_start_day + '6 days'::interval, 'Mon DD') AS name,
        COALESCE(aws.sessions_count, 0) AS sessions
      FROM date_range_weeks drw
      LEFT JOIN actual_weekly_sessions aws ON drw.week_start_day = aws.week_start_day_of_session
      ORDER BY drw.week_start_day ASC;
    `;
    // Note on column casing: Using b."tutorID" and b."StartTime".
    // Adjust if your column names are lowercase (tutorid, starttime).

    const result = await client.query(weeklySessionsQuery, finalQueryParams);

    const chartData = result.rows.map(row => ({
      name: row.name,
      sessions: parseInt(row.sessions, 10)
    }));

    return NextResponse.json(chartData, { status: 200 });

  } catch (error) {
    console.error('Error fetching weekly sessions:', error);
    let errorMessage = 'An unknown error occurred';
    if (error instanceof Error) errorMessage = error.message;
    return NextResponse.json({ message: 'Error fetching weekly sessions', error: errorMessage }, { status: 500 });
  } finally {
    client.release();
  }
}