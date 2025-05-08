// /app/api/tutor-profile/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { Pool } from 'pg';

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false }
});

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const tutorID = searchParams.get('tutorID');

  if (!tutorID) {
    return NextResponse.json({ error: 'Missing tutorID' }, { status: 400 });
  }

  try {
    const client = await pool.connect();

    const tutorRes = await client.query(
      `SELECT * FROM "mstutor" WHERE "tutorid" = $1`,
      [tutorID]
    );

    const subjectRes = await client.query(
      `SELECT s.name 
       FROM Subject s 
       JOIN TutorSubject ts ON ts.subjectID = s.subjectID 
       WHERE ts.tutorID = $1`,
      [tutorID]
    );

    const daysRes = await client.query(
      `SELECT DISTINCT day 
       FROM TutorAvailability 
       WHERE tutorID = $1`,
      [tutorID]
    );

    client.release();

    if (tutorRes.rows.length === 0) {
      return NextResponse.json({ error: 'Tutor not found' }, { status: 404 });
    }

    const dayMap = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    const availableDays = daysRes.rows.map(d => dayMap[d.day]);

    return NextResponse.json({
      ...tutorRes.rows[0],
      subjects: subjectRes.rows.map(s => s.name),
      availableDays
    });
  } catch (err) {
    console.error('Error:', err);
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}
