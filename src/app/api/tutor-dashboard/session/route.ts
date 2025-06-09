// app/api/tutor/session-history/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { Pool } from 'pg';

// Initialize the database pool
// Ensure your DATABASE_URL environment variable is set
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false,
  },
});

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const tutorId = searchParams.get('tutorId');

  if (!tutorId) {
    return NextResponse.json({ message: 'tutorId is required' }, { status: 400 });
  }

  const client = await pool.connect();

  try {
    const sessionHistoryQuery = `
      SELECT 
        TO_CHAR(b."StartTime", 'YYYY-MM-DD') AS date,
        TO_CHAR(b."StartTime", 'HH24:MI') AS startTime,
        TO_CHAR(b."EndTime", 'HH24:MI') AS endTime,
        b."SubjectBooked" AS subject,
        tf.firstname AS tuteeFirstName,
        tf.lastname AS tuteeLastName,
        mt.price 
      FROM 
        booking b
      JOIN 
        tuteeform tf ON b."tuteeID" = tf.tuteeid
      JOIN
        MsTutor mt ON b."tutorID" = mt.tutorId 
      WHERE 
        b."tutorID" = $1
      ORDER BY 
        b."StartTime" DESC
    `;

    const result = await client.query(sessionHistoryQuery, [tutorId]);

    return NextResponse.json(result.rows, { status: 200 });

  } catch (error) {
    console.error('Error fetching tutor session history:', error);
    const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred';
    return NextResponse.json({ message: 'Error fetching tutor session history', error: errorMessage }, { status: 500 });
  } finally {
    client.release();
  }
}