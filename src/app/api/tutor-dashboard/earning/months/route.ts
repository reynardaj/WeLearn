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
    const priceQuery = `SELECT price FROM mstutor WHERE tutorid = $1;`;
    const priceResult = await client.query(priceQuery, [tutorId]);
    if (priceResult.rows.length === 0) {
      return NextResponse.json({ message: 'Tutor not found or price not set' }, { status: 404 });
    }
    const tutorPrice = parseInt(priceResult.rows[0].price, 10);
    if (isNaN(tutorPrice) || tutorPrice < 0) {
        return NextResponse.json({ message: 'Invalid tutor price found' }, { status: 400 });
    }

    const finalQueryParams: (string | number)[] = [tutorId];
    let seriesStart: string;
    let seriesEnd: string;
    let paramIndex = 2;

    if (startDateParam && endDateParam) {
      seriesStart = `date_trunc('month', $${paramIndex++}::date)`;
      finalQueryParams.push(startDateParam);
      seriesEnd = `date_trunc('month', $${paramIndex++}::date)`;
      finalQueryParams.push(endDateParam);
    } else {
      const currentYear = new Date().getFullYear();
      seriesStart = `make_date($${paramIndex++}::integer, 1, 1)`;
      finalQueryParams.push(currentYear);
      seriesEnd = `make_date($${paramIndex++}::integer, 12, 1)`;
      finalQueryParams.push(currentYear);
    }
    
    const monthlySessionsQuery = `
      WITH date_range_months AS (
        SELECT
          generated_month::date,
          TO_CHAR(generated_month, 'Mon YYYY') AS name,
          TO_CHAR(generated_month, 'YYYY-MM') AS sort_key
        FROM generate_series(
          ${seriesStart}::date,
          ${seriesEnd}::date,
          '1 month'::interval
        ) AS generated_month
      ),
      actual_monthly_sessions AS (
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
      SELECT
        drm.name,
        COALESCE(ams.sessions_count, 0) AS sessions_count
      FROM date_range_months drm
      LEFT JOIN actual_monthly_sessions ams ON drm.generated_month = ams.month_date_for_join
      ORDER BY drm.sort_key ASC;
    `;

    const sessionCountsResult = await client.query(monthlySessionsQuery, finalQueryParams);

    const chartData = sessionCountsResult.rows.map(row => ({
      name: row.name,
      earning: parseInt(row.sessions_count, 10) * tutorPrice
    }));

    return NextResponse.json(chartData, { status: 200 });

  } catch (error) {
    console.error('Error fetching monthly earnings:', error);
    let errorMessage = 'An unknown error occurred';
    if (error instanceof Error) errorMessage = error.message;
    return NextResponse.json({ message: 'Error fetching monthly earnings', error: errorMessage }, { status: 500 });
  } finally {
    client.release();
  }
}