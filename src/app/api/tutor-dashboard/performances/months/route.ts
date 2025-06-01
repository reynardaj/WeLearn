// app/api/tutor-dashboard/performances/months/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { Pool } from 'pg';

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false,
  },
});

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const tutorId = searchParams.get('tutorId');

  if (!tutorId) {
    return NextResponse.json({ message: 'tutorId query parameter is required' }, { status: 400 });
  }

  const client = await pool.connect();

  try {
    const currentYear = new Date().getFullYear(); // Get current year as a number

    // Use $1 for tutorId and $2 for currentYear in the query
    const sessionsByMonthQuery = `
      WITH current_year_months AS (
        SELECT
          TO_CHAR(month_date, 'Mon YYYY') AS name,
          TO_CHAR(month_date, 'YYYY-MM') AS sort_key,
          month_date
        FROM
          generate_series(
            make_date($2::integer, 1, 1),      -- Use $2 for currentYear, cast to integer
            make_date($2::integer, 12, 1),     -- Use $2 for currentYear, cast to integer
            '1 month'::interval
          ) AS month_date
      ),
      actual_sessions_current_year AS (
        SELECT
          date_trunc('month', b."StartTime") as month_date_for_join,
          COUNT(*) AS sessions_count
        FROM
          booking b
        WHERE
          b."tutorID" = $1  -- $1 for tutorId
          AND EXTRACT(YEAR FROM b."StartTime") = $2::integer -- Use $2 for currentYear, cast to integer
        GROUP BY
          date_trunc('month', b."StartTime")
      )
      SELECT
        cym.name,
        COALESCE(asc_year.sessions_count, 0) AS sessions
      FROM
        current_year_months cym
      LEFT JOIN
        actual_sessions_current_year asc_year ON cym.month_date = asc_year.month_date_for_join
      ORDER BY
        cym.sort_key ASC;
    `;
    // Notes on column names:
    // - b."StartTime", b."tutorID": Assumes these are case-sensitive. Adjust if lowercase.

    // Pass tutorId as $1 and currentYear as $2
    const result = await client.query(sessionsByMonthQuery, [tutorId, currentYear]);

    const chartData = result.rows.map(row => ({
      name: row.name,
      sessions: parseInt(row.sessions, 10)
    }));

    return NextResponse.json(chartData, { status: 200 });

  } catch (error) {
    console.error('Error fetching current year monthly sessions:', error);
    let errorMessage = 'An unknown error occurred';
    const errorCode = 'UNKNOWN_ERROR';
    if (error instanceof Error) {
        errorMessage = error.message;
    }
    return NextResponse.json({ 
        message: 'Error fetching current year monthly sessions', 
        error: errorMessage, 
        errorCode: errorCode 
    }, { status: 500 });
  } finally {
    client.release();
  }
}