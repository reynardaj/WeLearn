// app/api/tutor-dashboard/earning/days/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { Pool } from 'pg';

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false },
});

const getDayDiff = (dateStr1: string, dateStr2: string): number => {
    const d1 = new Date(dateStr1);
    const d2 = new Date(dateStr2);
    const timeDiff = Math.abs(d2.getTime() - d1.getTime());
    return Math.ceil(timeDiff / (1000 * 3600 * 24));
};

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const tutorId = searchParams.get('tutorId');
  const startDateParam = searchParams.get('startDate');
  const endDateParam = searchParams.get('endDate');

  if (!tutorId) {
    return NextResponse.json({ message: 'tutorId query parameter is required' }, { status: 400 });
  }

  if (startDateParam && endDateParam) {
    if (new Date(endDateParam) < new Date(startDateParam)) {
      return NextResponse.json({ message: 'endDate cannot be before startDate' }, { status: 400 });
    }
    if (getDayDiff(startDateParam, endDateParam) > 6) {
        return NextResponse.json({ message: 'The maximum date range for this view is 7 days.' }, { status: 400 });
    }
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
        seriesStart = `date_trunc('week', NOW()::date)`;
        seriesEnd = `(date_trunc('week', NOW()::date) + '6 days'::interval)`;
    }

    const dailySessionsQuery = `
      WITH current_period_days AS (
        SELECT
          generated_day::date AS day_date,
          TO_CHAR(generated_day, 'Dy, Mon DD') AS name
        FROM generate_series(
          ${seriesStart}::date,
          ${seriesEnd}::date,
          '1 day'::interval
        ) AS generated_day
      ),
      actual_daily_sessions AS (
        SELECT
          date_trunc('day', b."StartTime")::date AS session_day,
          COUNT(*) AS sessions_count
        FROM booking b
        WHERE b."tutorID" = $1
          AND b."StartTime" >= ${seriesStart}::date
          AND b."StartTime" < (${seriesEnd}::date + '1 day'::interval)
        GROUP BY 1
      )
      SELECT
        cwd.name,
        COALESCE(ads.sessions_count, 0) AS sessions_count
      FROM current_period_days cwd
      LEFT JOIN actual_daily_sessions ads ON cwd.day_date = ads.session_day
      ORDER BY cwd.day_date ASC;
    `;

    const sessionCountsResult = await client.query(dailySessionsQuery, finalQueryParams);

    const chartData = sessionCountsResult.rows.map(row => ({
      name: row.name,
      earning: parseInt(row.sessions_count, 10) * tutorPrice
    }));

    return NextResponse.json(chartData, { status: 200 });

  } catch (error) {
    console.error('Error fetching daily earnings:', error);
    let errorMessage = 'An unknown error occurred';
    if (error instanceof Error) errorMessage = error.message;
    return NextResponse.json({ message: 'Error fetching daily earnings', error: errorMessage }, { status: 500 });
  } finally {
    client.release();
  }
}
