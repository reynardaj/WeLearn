// app/api/tutor-dashboard/sessions-by-date/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { Pool } from 'pg';

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false },
});

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const tutorId = searchParams.get('tutorId');
  const sessionDate = searchParams.get('date'); // Expects 'YYYY-MM-DD' format

  if (!tutorId || !sessionDate) {
    return NextResponse.json({ message: 'tutorId and date are required' }, { status: 400 });
  }

  const client = await pool.connect();

  try {
    const sessionsQuery = `
      SELECT
        TO_CHAR(b."StartTime", 'Dy, Mon DD') AS session_date_formatted,
        TO_CHAR(b."StartTime", 'HH24:MI') AS session_start_time,
        TO_CHAR(b."EndTime", 'HH24:MI') AS session_end_time,
        b."SubjectBooked" AS subject,
        tf.firstname AS tutee_firstname,
        tf.lastname AS tutee_lastname
      FROM
        booking b
      JOIN
        tuteeform tf ON b."tuteeID" = tf.tuteeid
      WHERE
        b."tutorID" = $1
        AND b."StartTime"::date = $2::date -- Filter by the specific date
      ORDER BY
        b."StartTime" ASC;
    `;
    
    const result = await client.query(sessionsQuery, [tutorId, sessionDate]);
    const sessions = result.rows.map(row => ({
      dateDisplay: row.session_date_formatted,
      startTime: row.session_start_time,
      endTime: row.session_end_time,
      subject: row.subject,
      tuteeName: `${row.tutee_firstname || ''} ${row.tutee_lastname || ''}`.trim(),
    }));

    return NextResponse.json(sessions, { status: 200 });

  } catch (error) {
    console.error('Error fetching sessions by date:', error);
    let errorMessage = 'An unknown error occurred';
    if (error instanceof Error) errorMessage = error.message;
    return NextResponse.json({ message: 'Error fetching sessions', error: errorMessage }, { status: 500 });
  } finally {
    client.release();
  }
}