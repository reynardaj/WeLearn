// app/api/tutor-dashboard/calenderMark/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { Pool } from 'pg';

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false },
});

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const tutorId = searchParams.get('tutorId');
  const year = searchParams.get('year');
  const month = searchParams.get('month');

  if (!tutorId || !year || !month) {
    return NextResponse.json({ message: 'tutorId, year, and month are required' }, { status: 400 });
  }

  const client = await pool.connect();

  try {
    const sessionDatesQuery = `
      SELECT DISTINCT TO_CHAR(b."StartTime", 'YYYY-MM-DD') AS session_date
      FROM booking b
      WHERE b."tutorID" = $1
        AND EXTRACT(YEAR FROM b."StartTime") = $2
        AND EXTRACT(MONTH FROM b."StartTime") = $3
        AND b."StartTime" >= NOW(); -- **FIX: Only include future sessions**
    `;
    
    const result = await client.query(sessionDatesQuery, [tutorId, year, month]);
    const datesWithSessions = result.rows.map(row => row.session_date);
    return NextResponse.json(datesWithSessions, { status: 200 });

  } catch (error) {
    console.error('Error fetching calendar markers:', error);
    let errorMessage = 'An unknown error occurred';
    if (error instanceof Error) errorMessage = error.message;
    return NextResponse.json({ message: 'Error fetching markers', error: errorMessage }, { status: 500 });
  } finally {
    client.release();
  }
}