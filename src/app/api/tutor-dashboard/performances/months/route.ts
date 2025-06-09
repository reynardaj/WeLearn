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
    let seriesStart: string;
    let seriesEnd: string;
    let paramIndex = 2;

    if (startDateParam && endDateParam) {
      // Use the provided date range
      seriesStart = `date_trunc('month', $${paramIndex++}::date)`;
      finalQueryParams.push(startDateParam);
      seriesEnd = `date_trunc('month', $${paramIndex++}::date)`;
      finalQueryParams.push(endDateParam);
    } else {
      // Default to the current year
      const currentYear = new Date().getFullYear();
      seriesStart = `make_date($${paramIndex++}::integer, 1, 1)`;
      finalQueryParams.push(currentYear);
      seriesEnd = `make_date($${paramIndex++}::integer, 12, 1)`;
      finalQueryParams.push(currentYear);
    }
    
    const sessionsByMonthQuery = `
      WITH date_range_months AS (
        -- 1. Generate a series of all months in the given range
        SELECT
          generated_month::date,
          TO_CHAR(generated_month, 'Mon YYYY') AS name,
          TO_CHAR(generated_month, 'YYYY-MM') AS sort_key
        FROM generate_series(
          ${seriesStart},
          ${seriesEnd},
          '1 month'::interval
        ) AS generated_month
      ),
      actual_monthly_sessions AS (
        -- 2. Get actual session counts per month for the tutor within the range
        SELECT
          date_trunc('month', b."StartTime") as month_date_for_join,
          COUNT(*) AS sessions_count
        FROM booking b
        WHERE
          b."tutorID" = $1
          AND b."StartTime" >= (${seriesStart})::date
          AND b."StartTime" < (${seriesEnd})::date + '1 month'::interval
        GROUP BY 1
      )
      -- 3. Left join all months with actual sessions
      SELECT
        drm.name,
        COALESCE(ams.sessions_count, 0) AS sessions
      FROM date_range_months drm
      LEFT JOIN actual_monthly_sessions ams ON drm.generated_month = ams.month_date_for_join
      ORDER BY drm.sort_key ASC;
    `;
    // Note on column casing: Using b."StartTime", b."tutorID".
    // Adjust if your column names are lowercase (tutorid, starttime).

    const result = await client.query(sessionsByMonthQuery, finalQueryParams);

    const chartData = result.rows.map(row => ({
      name: row.name,
      sessions: parseInt(row.sessions, 10)
    }));

    return NextResponse.json(chartData, { status: 200 });

  } catch (error) {
    console.error('Error fetching monthly sessions:', error);
    let errorMessage = 'An unknown error occurred';
    if (error instanceof Error) errorMessage = error.message;
    return NextResponse.json({ message: 'Error fetching monthly sessions', error: errorMessage }, { status: 500 });
  } finally {
    client.release();
  }
}