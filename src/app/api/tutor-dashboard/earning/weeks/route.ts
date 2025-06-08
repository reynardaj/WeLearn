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

    const finalQueryParams: string[] = [tutorId];
    let seriesStart: string;
    let seriesEnd: string;
    let paramIndex = 2;

    if (startDateParam && endDateParam) {
        seriesStart = `$${paramIndex++}`;
        finalQueryParams.push(startDateParam);
        seriesEnd = `$${paramIndex++}`;
        finalQueryParams.push(endDateParam);
    } else {
        seriesStart = `date_trunc('month', NOW()::date)`;
        seriesEnd = `(date_trunc('month', NOW()::date) + interval '1 month' - interval '1 day')`;
    }

    const weeklySessionsQuery = `
      WITH date_chunks AS (
        SELECT generated_chunk_start::date
        FROM generate_series(
          ${seriesStart}::date,
          ${seriesEnd}::date,
          '7 days'::interval
        ) AS generated_chunk_start
      )
      SELECT
        TO_CHAR(dc.generated_chunk_start, 'Mon DD') || ' - ' || TO_CHAR(
          LEAST(dc.generated_chunk_start + '6 days'::interval, ${seriesEnd}::date),
          'Mon DD'
        ) AS name,
        (
          SELECT COUNT(*)
          FROM booking b
          WHERE b."tutorID" = $1
            AND b."StartTime" >= dc.generated_chunk_start
            AND b."StartTime" < LEAST(dc.generated_chunk_start + '7 days'::interval, ${seriesEnd}::date + '1 day'::interval)
        ) AS sessions_count
      FROM date_chunks dc
      ORDER BY dc.generated_chunk_start;
    `;

    const sessionCountsResult = await client.query(weeklySessionsQuery, finalQueryParams);

    const chartData = sessionCountsResult.rows.map(row => ({
      name: row.name,
      earning: parseInt(row.sessions_count, 10) * tutorPrice
    }));

    return NextResponse.json(chartData, { status: 200 });

  } catch (error) {
    console.error('Error fetching weekly earnings:', error);
    let errorMessage = 'An unknown error occurred';
    if (error instanceof Error) errorMessage = error.message;
    return NextResponse.json({ message: 'Error fetching weekly earnings', error: errorMessage }, { status: 500 });
  } finally {
    client.release();
  }
}