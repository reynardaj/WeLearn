// app/api/tutor-dashboard/performances/days/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { Pool } from 'pg';

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false },
});

// Helper function to calculate day difference
const getDayDiff = (dateStr1: string, dateStr2: string): number => {
    const d1 = new Date(dateStr1);
    const d2 = new Date(dateStr2);
    const timeDiff = Math.abs(d2.getTime() - d1.getTime());
    return Math.ceil(timeDiff / (1000 * 3600 * 24));
};


export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const tutorId = searchParams.get('tutorId');
  const startDateParam = searchParams.get('startDate'); // YYYY-MM-DD
  const endDateParam = searchParams.get('endDate');     // YYYY-MM-DD

  if (!tutorId) {
    return NextResponse.json({ message: 'tutorId is required' }, { status: 400 });
  }

  // --- SERVER-SIDE VALIDATION ---
  if (startDateParam && endDateParam) {
    if (new Date(endDateParam) < new Date(startDateParam)) {
      return NextResponse.json({ message: 'endDate cannot be before startDate' }, { status: 400 });
    }
    // For this specific 'daily' endpoint, enforce the 7-day max rule
    if (getDayDiff(startDateParam, endDateParam) > 6) {
        return NextResponse.json({ message: 'The maximum date range for this view is 7 days.' }, { status: 400 });
    }
  }

  const client = await pool.connect();
  try {
    const finalQueryParams: string[] = [tutorId];
    let seriesStart: string;
    let seriesEnd: string;

    if (startDateParam) {
      seriesStart = startDateParam;
      // If only startDate is given, endDate is 6 days after. If both are given, use endDateParam.
      seriesEnd = endDateParam ?? new Date(new Date(startDateParam).setDate(new Date(startDateParam).getDate() + 6)).toISOString().split('T')[0];
    } else {
      // Default to the current week (Monday to Sunday)
      const today = new Date();
      // Logic to correctly find Monday of the current week
      const dayOfWeek = today.getDay(); // Sunday - 0, Monday - 1, ...
      const mondayOffset = dayOfWeek === 0 ? -6 : 1 - dayOfWeek;
      const monday = new Date(new Date().setDate(today.getDate() + mondayOffset));
      const sunday = new Date(monday);
      sunday.setDate(monday.getDate() + 6);
      seriesStart = monday.toISOString().split('T')[0];
      seriesEnd = sunday.toISOString().split('T')[0];
    }
    
    finalQueryParams.push(seriesStart, seriesEnd);

    const finalDailySessionsQuery = `
      WITH current_period_days AS (
        SELECT
          generated_day::date AS day_date,
          EXTRACT(ISODOW FROM generated_day) AS day_of_week_num,
          TO_CHAR(generated_day, 'Dy, Mon DD') AS name
        FROM generate_series(
          $2::date, 
          $3::date, 
          '1 day'::interval
        ) AS generated_day
      ),
      actual_daily_sessions AS (
        SELECT
          date_trunc('day', b."StartTime")::date AS session_day,
          COUNT(*) AS sessions_count
        FROM booking b
        WHERE b."tutorID" = $1 
          AND b."StartTime" >= $2::date
          AND b."StartTime" < ($3::date + '1 day'::interval)
        GROUP BY 1
      )
      SELECT
        cpd.name,
        COALESCE(ads.sessions_count, 0) AS sessions
      FROM current_period_days cpd
      LEFT JOIN actual_daily_sessions ads ON cpd.day_date = ads.session_day
      ORDER BY cpd.day_date ASC; 
    `;

    const result = await client.query(finalDailySessionsQuery, finalQueryParams);

    const chartData = result.rows.map(row => ({
      name: row.name,
      sessions: parseInt(row.sessions, 10)
    }));
    return NextResponse.json(chartData, { status: 200 });

  } catch (error) { 
    console.error('Error fetching daily sessions for current week:', error);
    let errorMessage = 'An unknown error occurred';
    if (error instanceof Error) errorMessage = error.message;
    return NextResponse.json({ message: 'Error fetching daily sessions', error: errorMessage }, { status: 500 });
  } finally { 
    client.release(); 
  }
}