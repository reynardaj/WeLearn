// app/api/tutor-dashboard/calendar-markers/route.ts
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
  const month = searchParams.get('month'); // Expected as 1-12

  if (!tutorId || !year || !month) {
    return NextResponse.json({ message: 'tutorId, year, and month query parameters are required' }, { status: 400 });
  }

  const numericYear = parseInt(year, 10);
  const numericMonth = parseInt(month, 10);

  if (isNaN(numericYear) || isNaN(numericMonth) || numericMonth < 1 || numericMonth > 12) {
    return NextResponse.json({ message: 'Invalid year or month provided' }, { status: 400 });
  }

  const client = await pool.connect();

  try {
    const sessionDatesQuery = `
      SELECT DISTINCT TO_CHAR(b."StartTime", 'YYYY-MM-DD') AS session_date
      FROM booking b
      WHERE b."tutorID" = $1
        AND EXTRACT(YEAR FROM b."StartTime") = $2
        AND EXTRACT(MONTH FROM b."StartTime") = $3;
    `;
    // Note on column casing: b."StartTime", b."tutorID" are quoted assuming case-sensitivity.
    // Adjust if your column names are lowercase (e.g., starttime, tutorid).

    const result = await client.query(sessionDatesQuery, [tutorId, numericYear, numericMonth]);

    const datesWithSessions = result.rows.map(row => row.session_date);

    return NextResponse.json(datesWithSessions, { status: 200 });

  } catch (error) {
    console.error('Error fetching calendar session markers:', error);
    let errorMessage = 'An unknown error occurred';
    // ... (full error handling as in previous examples) ...
    if (error instanceof Error) errorMessage = error.message;
    return NextResponse.json({ message: 'Error fetching calendar session markers', error: errorMessage }, { status: 500 });
  } finally {
    client.release();
  }
}