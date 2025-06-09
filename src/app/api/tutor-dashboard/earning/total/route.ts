// app/api/tutor-dashboard/total-earning/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { Pool } from 'pg';

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false },
});

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const tutorId = searchParams.get('tutorId');

  if (!tutorId) {
    return NextResponse.json({ message: 'tutorId query parameter is required' }, { status: 400 });
  }

  const client = await pool.connect();

  try {
    // This single, efficient query joins the tables, counts the bookings,
    // and multiplies by the tutor's price.
    const totalEarningQuery = `
      SELECT
        (COUNT(b.*) * m.price) AS total_earning
      FROM
        mstutor m
      LEFT JOIN
        booking b ON m.tutorid = b."tutorID"
      WHERE
        m.tutorid = $1
      GROUP BY
        m.price;
    `;
    // Note on column casing:
    // m.tutorid is lowercase as per your mstutor diagram.
    // b."tutorID" is quoted assuming it's case-sensitive from your booking diagram.
    // Please adjust if your actual column names are all lowercase.

    const result = await client.query(totalEarningQuery, [tutorId]);

    // If the tutor has no bookings, the result might be empty. Default to 0.
    const totalEarning = parseInt(result.rows[0]?.total_earning || '0', 10);

    return NextResponse.json({ totalEarning }, { status: 200 });

  } catch (error) {
    console.error('Error fetching total earning:', error);
    let errorMessage = 'An unknown error occurred';
    if (error instanceof Error) errorMessage = error.message;
    return NextResponse.json({ message: 'Error fetching total earning', error: errorMessage }, { status: 500 });
  } finally {
    client.release();
  }
}
