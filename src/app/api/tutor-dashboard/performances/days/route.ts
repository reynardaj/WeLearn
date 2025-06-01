// app/api/tutor-dashboard/performances/days/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { Pool } from 'pg';

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false },
});

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const tutorId = searchParams.get('tutorId');
  const currentDate = new Date().toISOString(); // Current date for determining the week

  if (!tutorId) {
    return NextResponse.json({ message: 'tutorId query parameter is required' }, { status: 400 });
  }

  const client = await pool.connect();

  try {
    const dailySessionsQuery = `
      WITH current_week_days AS (
        SELECT
          generated_day::date AS day_date,
          EXTRACT(ISODOW FROM generated_day) AS day_of_week_num, -- 1 for Mon, 7 for Sun
          -- Updated TO_CHAR to include Day, Month, and Date
          TO_CHAR(generated_day, 'Dy, Mon DD') AS name -- e.g., 'Mon, May 26'
        FROM generate_series(
          date_trunc('week', $2::date), -- Start of the week (Monday) based on $2
          date_trunc('week', $2::date) + '6 days'::interval, -- End of the week (Sunday)
          '1 day'::interval
        ) AS generated_day
      ),
      actual_daily_sessions AS (
        SELECT
          date_trunc('day', b."StartTime")::date AS session_day,
          COUNT(*) AS sessions_count
        FROM booking b
        WHERE b."tutorID" = $1
          AND b."StartTime" >= date_trunc('week', $2::date)
          AND b."StartTime" < date_trunc('week', $2::date) + '7 days'::interval
        GROUP BY 1
      )
      SELECT
        cwd.name,
        COALESCE(ads.sessions_count, 0) AS sessions
      FROM current_week_days cwd
      LEFT JOIN actual_daily_sessions ads ON cwd.day_date = ads.session_day
      ORDER BY cwd.day_of_week_num ASC;
    `;
    // Note on column casing: Using b."tutorID" and b."StartTime".
    // If your columns are lowercase (tutorid, starttime), remove the double quotes.

    const result = await client.query(dailySessionsQuery, [tutorId, currentDate]);

    const chartData = result.rows.map(row => ({
      name: row.name, // This will now be "Mon, May 26", etc.
      sessions: parseInt(row.sessions, 10)
    }));

    return NextResponse.json(chartData, { status: 200 });

  } catch (error) {
    console.error('Error fetching daily sessions for current week:', error);
    let errorMessage = 'An unknown error occurred';
    // ... (full error handling as in previous examples) ...
    if (error instanceof Error) errorMessage = error.message;
    return NextResponse.json({ message: 'Error fetching daily sessions', error: errorMessage }, { status: 500 });
  } finally {
    client.release();
  }
}