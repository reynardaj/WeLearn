// app/api/tutor-dashboard/performances/years/route.ts
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

  // Validate dates if they exist
  if (startDateParam && endDateParam && new Date(endDateParam) < new Date(startDateParam)) {
    return NextResponse.json({ message: 'endDate cannot be before startDate' }, { status: 400 });
  }

  const client = await pool.connect();

  try {
    const finalQueryParams: (string | number)[] = [tutorId];
    let startYear: number;
    let endYear: number;
    
    let whereClauseDateFilter = "";

    if (startDateParam && endDateParam) {
      startYear = new Date(startDateParam).getFullYear();
      endYear = new Date(endDateParam).getFullYear();
      // Filter sessions between the exact start and end dates
      whereClauseDateFilter = `AND b."StartTime" >= $${finalQueryParams.length + 1} AND b."StartTime" <= $${finalQueryParams.length + 2}`;
      finalQueryParams.push(startDateParam, endDateParam);
    } else {
      // Default to current year and previous 5 years
      endYear = new Date().getFullYear();
      startYear = endYear - 5;
      // Filter sessions between the start and end of this 6-year period
      whereClauseDateFilter = `AND EXTRACT(YEAR FROM b."StartTime") BETWEEN $${finalQueryParams.length + 1} AND $${finalQueryParams.length + 2}`;
      finalQueryParams.push(startYear, endYear);
    }

    finalQueryParams.push(startYear, endYear); // Add years for the generate_series
    const seriesStartParamIndex = finalQueryParams.length - 1;
    const seriesEndParamIndex = finalQueryParams.length;

    const yearlySessionsQuery = `
      WITH target_years AS (
        SELECT generate_series($${seriesStartParamIndex}::integer, $${seriesEndParamIndex}::integer, 1) AS year_num
      ),
      actual_yearly_sessions AS (
        SELECT
          EXTRACT(YEAR FROM b."StartTime") AS session_year,
          COUNT(*) AS sessions_count
        FROM booking b
        WHERE b."tutorID" = $1
          ${whereClauseDateFilter} -- Apply the dynamic date filter
        GROUP BY 1
      )
      SELECT
        ty.year_num::text AS name, -- Year as string for 'name'
        COALESCE(ays.sessions_count, 0) AS sessions
      FROM target_years ty
      LEFT JOIN actual_yearly_sessions ays ON ty.year_num = ays.session_year
      ORDER BY ty.year_num ASC;
    `;
    // Note on column casing: Using b."StartTime", b."tutorID".
    // Adjust if your column names are lowercase (tutorid, starttime).

    const result = await client.query(yearlySessionsQuery, finalQueryParams);

    const chartData = result.rows.map(row => ({
      name: row.name,
      sessions: parseInt(row.sessions, 10)
    }));

    return NextResponse.json(chartData, { status: 200 });

  } catch (error) {
    console.error('Error fetching yearly sessions:', error);
    let errorMessage = 'An unknown error occurred';
    if (error instanceof Error) errorMessage = error.message;
    return NextResponse.json({ message: 'Error fetching yearly sessions', error: errorMessage }, { status: 500 });
  } finally {
    client.release();
  }
}