// app/api/tutor-dashboard/upcoming-sessions/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { Pool } from 'pg';

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false },
});

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const tutorId = searchParams.get('tutorId');
  const currentTimestamp = new Date().toISOString(); // To filter for future sessions

  if (!tutorId) {
    return NextResponse.json({ message: 'tutorId query parameter is required' }, { status: 400 });
  }

  const client = await pool.connect();

  try {
    const upcomingSessionsQuery = `
      SELECT
        TO_CHAR(b."StartTime", 'Dy, Mon DD') AS session_date_formatted, -- e.g., Mon, Jun 02
        TO_CHAR(b."StartTime", 'HH24:MI') AS session_start_time,      -- e.g., 14:00
        TO_CHAR(b."EndTime", 'HH24:MI') AS session_end_time,        -- e.g., 15:00
        b."SubjectBooked" AS subject,
        tf.firstname AS tutee_firstname,
        tf.lastname AS tutee_lastname
      FROM
        booking b
      JOIN
        tuteeform tf ON b."tuteeID" = tf.tuteeid -- tf.tuteeid is lowercase as per tuteeform image
      WHERE
        b."tutorID" = $1                         -- $1 for tutorId
        AND b."StartTime" > $2::timestamp      -- $2 for currentTimestamp, ensuring future sessions
      ORDER BY
        b."StartTime" ASC
      LIMIT 5; -- Fetch the next 5 upcoming sessions
    `;
    // Note on column casing:
    // b."StartTime", b."tutorID", b."tuteeID" are quoted assuming case-sensitivity from your diagrams.
    // tf.tuteeid, tf.firstname, tf.lastname are assumed lowercase based on tuteeform diagram.
    // Adjust if your actual database column names differ (e.g., all lowercase).

    const result = await client.query(upcomingSessionsQuery, [tutorId, currentTimestamp]);

    const upcomingSessions = result.rows.map(row => ({
      dateDisplay: row.session_date_formatted,
      startTime: row.session_start_time,
      endTime: row.session_end_time,
      subject: row.subject,
      tuteeName: `${row.tutee_firstname || ''} ${row.tutee_lastname || ''}`.trim(),
    }));

    return NextResponse.json(upcomingSessions, { status: 200 });

  } catch (error) {
    console.error('Error fetching upcoming sessions:', error);
    let errorMessage = 'An unknown error occurred';
    const errorCode = 'UNKNOWN_ERROR';
    if (error instanceof Error) {
        errorMessage = error.message;
    }
    return NextResponse.json({ 
        message: 'Error fetching upcoming sessions', 
        error: errorMessage, 
        errorCode: errorCode 
    }, { status: 500 });
  } finally {
    client.release();
  }
}