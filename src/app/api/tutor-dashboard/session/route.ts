// app/api/tutor-dashboard/session/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { Pool } from 'pg';

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false,
  },
});

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const tutorId = searchParams.get('tutorId');
  const startDate = searchParams.get('startDate');
  const endDate = searchParams.get('endDate');

  if (!tutorId) {
    return NextResponse.json({ message: 'tutorId is required' }, { status: 400 });
  }

  // Validate that endDate is not before startDate
  if (startDate && endDate && new Date(endDate) < new Date(startDate)) {
    return NextResponse.json({ message: 'End date cannot be before start date.'}, { status: 400 });
  }

  const client = await pool.connect();

  try {
    // Base query
    let sessionHistoryQuery = `
      SELECT 
        TO_CHAR(b."StartTime", 'YYYY-MM-DD') AS date,
        TO_CHAR(b."StartTime", 'HH24:MI') AS starttime,
        TO_CHAR(b."EndTime", 'HH24:MI') AS endtime,
        b."SubjectBooked" AS subject,
        tf.firstname AS tuteefirstname,
        tf.lastname AS tuteelastname,
        mt.price 
      FROM 
        booking b
      JOIN 
        tuteeform tf ON b."tuteeID" = tf.tuteeid
      JOIN
        MsTutor mt ON b."tutorID" = mt.tutorid 
      WHERE 
        b."tutorID" = $1
    `;
    
    const queryParams: (string | null)[] = [tutorId];
    let paramIndex = 2; // $1 is already used for tutorId

    // Dynamically add date filters to the SQL query if they exist
    if (startDate) {
      sessionHistoryQuery += ` AND b."StartTime" >= $${paramIndex++}`;
      queryParams.push(startDate);
    }
    if (endDate) {
      // We add 1 day to the end date to make the filter inclusive of the entire end day
      sessionHistoryQuery += ` AND b."StartTime" < ($${paramIndex++}::date + interval '1 day')`;
      queryParams.push(endDate);
    }
    
    // Add the final ordering
    sessionHistoryQuery += ` ORDER BY b."StartTime" DESC`;

    const result = await client.query(sessionHistoryQuery, queryParams);

    return NextResponse.json(result.rows, { status: 200 });

  } catch (error) {
    console.error('Error fetching tutor session history:', error);
    const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred';
    return NextResponse.json({ message: 'Error fetching tutor session history', error: errorMessage }, { status: 500 });
  } finally {
    client.release();
  }
}