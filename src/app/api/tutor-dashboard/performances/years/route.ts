// app/api/tutor-dashboard/performances/yearly-last-6-years/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { Pool } from 'pg';

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false },
});

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const tutorId = searchParams.get('tutorId');
  const currentYear = new Date().getFullYear(); // Get current year as a number

  if (!tutorId) {
    return NextResponse.json({ message: 'tutorId query parameter is required' }, { status: 400 });
  }

  const client = await pool.connect();

  try {
    const yearlySessionsQuery = `
      WITH target_years AS (
        SELECT generate_series($2::integer - 5, $2::integer, 1) AS year_num -- $2 is currentYear
      ),
      actual_yearly_sessions AS (
        SELECT
          EXTRACT(YEAR FROM b."StartTime") AS session_year,
          COUNT(*) AS sessions_count
        FROM booking b
        WHERE b."tutorID" = $1
          AND EXTRACT(YEAR FROM b."StartTime") BETWEEN ($2::integer - 5) AND $2::integer
        GROUP BY 1
      )
      SELECT
        ty.year_num::text AS name, -- Year as string for 'name'
        COALESCE(ays.sessions_count, 0) AS sessions
      FROM target_years ty
      LEFT JOIN actual_yearly_sessions ays ON ty.year_num = ays.session_year
      ORDER BY ty.year_num ASC;
    `;

    const result = await client.query(yearlySessionsQuery, [tutorId, currentYear]);

    const chartData = result.rows.map(row => ({
      name: row.name,
      sessions: parseInt(row.sessions, 10)
    }));

    return NextResponse.json(chartData, { status: 200 });

  } catch (error) {
    console.error('Error fetching yearly sessions:', error);
    // ... (full error handling as in previous examples) ...
    let errorMessage = 'An unknown error occurred';
    if (error instanceof Error) errorMessage = error.message;
    return NextResponse.json({ message: 'Error fetching yearly sessions', error: errorMessage }, { status: 500 });
  } finally {
    client.release();
  }
}