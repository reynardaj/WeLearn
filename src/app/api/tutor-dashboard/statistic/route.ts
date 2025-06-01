// app/api/tutor-dashboard/summary-stats/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { Pool } from 'pg';

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false }, // Using SSL config from your recent examples
});

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const tutorId = searchParams.get('tutorId');

  if (!tutorId) {
    return NextResponse.json({ message: 'tutorId query parameter is required' }, { status: 400 });
  }

  const client = await pool.connect();

  try {
    // 1. Total Sessions from booking table
    const totalSessionsQuery = `SELECT COUNT(*) AS count FROM booking WHERE "tutorID" = $1;`;
    // Assuming "tutorID" in booking table is case-sensitive as per diagrams. If it's 'tutorid', remove quotes.
    const sessionsResult = await client.query(totalSessionsQuery, [tutorId]);
    const totalSessions = parseInt(sessionsResult.rows[0]?.count || '0', 10);

    // 2. Tutor's Price from mstutor table
    const priceQuery = `SELECT price FROM mstutor WHERE tutorid = $1;`; // mstutor.tutorid is lowercase in your diagram
    const priceResult = await client.query(priceQuery, [tutorId]);
    const pricePerSession = parseInt(priceResult.rows[0]?.price || '0', 10);

    // 3. Calculate Total Earning
    const totalEarning = totalSessions * pricePerSession;

    // 4. Average Rating from review table
    const avgRatingQuery = `SELECT AVG(rating) AS average_rating FROM review WHERE "tutorID" = $1;`;
    // Assuming "tutorID" in review table is case-sensitive.
    const avgRatingResult = await client.query(avgRatingQuery, [tutorId]);
    const averageRating = parseFloat(avgRatingResult.rows[0]?.average_rating || '0');

    // 5. Unique Students from booking table
    const uniqueStudentsQuery = `SELECT COUNT(DISTINCT "tuteeID") AS count FROM booking WHERE "tutorID" = $1;`;
    // Assuming "tuteeID" and "tutorID" in booking table are case-sensitive.
    const uniqueStudentsResult = await client.query(uniqueStudentsQuery, [tutorId]);
    const uniqueStudents = parseInt(uniqueStudentsResult.rows[0]?.count || '0', 10);

    return NextResponse.json({
      totalSessions,
      totalEarning,
      averageRating: averageRating > 0 ? parseFloat(averageRating.toFixed(1)) : 0, // Format to 1 decimal place
      uniqueStudents,
    }, { status: 200 });

  } catch (error) {
    console.error('Error fetching tutor feedback details:', error);
    let errorMessage = 'An unknown error occurred';
    if (error instanceof Error) errorMessage = error.message;
    return NextResponse.json({ 
        message: 'Error fetching tutor summary stats', 
        error: errorMessage, 
    }, { status: 500 });
  } finally {
    client.release();
  }
}