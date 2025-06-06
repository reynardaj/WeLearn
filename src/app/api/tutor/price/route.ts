import { NextRequest, NextResponse } from 'next/server';
import { Pool } from 'pg';

const pool = new Pool({  
  connectionString: process.env.DATABASE_URL,  
  ssl: { rejectUnauthorized: false }  
});

export async function GET(req: NextRequest) {
  const url = new URL(req.url);
  const tutorID = url.searchParams.get('tutorID');

  if (!tutorID) {
    return NextResponse.json(
      { error: 'Missing tutorID parameter' },
      { status: 400 }
    );
  }

  try {
    const client = await pool.connect();
    const result = await client.query(
      'SELECT price FROM mstutor WHERE tutorid = $1',
      [tutorID]
    );
    client.release();

    if (result.rows.length === 0) {
      return NextResponse.json(
        { error: 'Tutor not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      price: result.rows[0].price
    });

  } catch (error) {
    console.error('Database error:', error);
    return NextResponse.json(
      { error: 'Database error' },
      { status: 500 }
    );
  }
}
