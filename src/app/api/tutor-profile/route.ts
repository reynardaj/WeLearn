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

    // 1. Tutor profile
    const tutorRes = await client.query(
      `SELECT * FROM "mstutor" WHERE "tutorid" = $1`,
      [tutorID]
    );

    if (tutorRes.rows.length === 0) {
      client.release();
      return NextResponse.json({ error: 'Tutor not found' }, { status: 404 });
    }

    const tutor = tutorRes.rows[0];

    // 2. Subjects
    const subjectRes = await client.query(
      `SELECT s.subjects AS name 
       FROM Subjects s 
       JOIN TutorSubjects ts ON ts.subjectsID = s.subjectsID 
       WHERE ts.tutorID = $1`,
      [tutorID]
    );
    const subjects = subjectRes.rows.map(s => s.name);

    // 3. Available days
    const daysRes = await client.query(
      `SELECT DISTINCT day 
       FROM TutorAvailability 
       WHERE tutorID = $1`,
      [tutorID]
    );
    const dayMap = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    const availableDays = daysRes.rows.map(d => dayMap[d.day]);

    // 4. Reviews
    const reviewRes = await client.query(
      `SELECT r.rating, r.comment, t."firstname", t."lastname"
      FROM "review" r
      JOIN "tuteeform" t ON t."tuteeid" = r."tuteeID"
      WHERE r."tutorID" = $1`,
      [tutorID]
    );


    const reviews = reviewRes.rows.map(r => ({
      rating: r.rating,
      comment: r.comment,
      name: `${r.firstname} ${r.lastname}`
    }));

    client.release();

    return NextResponse.json({
      ...tutor,
      subjects,
      availableDays,
      reviews
    });
  } catch (err) {
    console.error('Error:', err);
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}
