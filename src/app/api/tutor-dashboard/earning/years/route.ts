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
    let startYear: number;
    let endYear: number;
    let whereClauseDateFilter = "";
    
    if (startDateParam && endDateParam) {
      startYear = new Date(startDateParam).getFullYear();
      endYear = new Date(endDateParam).getFullYear();
      whereClauseDateFilter = `AND b."StartTime" >= $2 AND b."StartTime" <= $3`;
      finalQueryParams.push(startDateParam, endDateParam, startYear, endYear);
    } else {
      endYear = new Date().getFullYear();
      startYear = endYear - 5;
      whereClauseDateFilter = `AND EXTRACT(YEAR FROM b."StartTime") BETWEEN $2 AND $3`;
      finalQueryParams.push(startYear, endYear, startYear, endYear);
    }

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
          ${whereClauseDateFilter}
        GROUP BY 1
      )
      SELECT
        ty.year_num::text AS name,
        COALESCE(ays.sessions_count, 0) AS sessions_count
      FROM target_years ty
      LEFT JOIN actual_yearly_sessions ays ON ty.year_num = ays.session_year
      ORDER BY ty.year_num ASC;
    `;

    const sessionCountsResult = await client.query(yearlySessionsQuery, finalQueryParams);

    const chartData = sessionCountsResult.rows.map(row => ({
      name: row.name,
      earning: parseInt(row.sessions_count, 10) * tutorPrice
    }));

    return NextResponse.json(chartData, { status: 200 });

  } catch (error) {
    console.error('Error fetching yearly earnings:', error);
    let errorMessage = 'An unknown error occurred';
    if (error instanceof Error) errorMessage = error.message;
    return NextResponse.json({ message: 'Error fetching yearly earnings', error: errorMessage }, { status: 500 });
  } finally {
    client.release();
  }
}