// app/api/tutor-dashboard/profile/route.ts
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

  if (!tutorId) {
    return NextResponse.json({ message: 'tutorId is required' }, { status: 400 });
  }

  const client = await pool.connect();

  try {
    // 1. Fetch main tutor details
    const tutorDetailsQuery = `
      SELECT 
        tutorId, 
        firstName, 
        lastName, 
        institution, 
        price, 
        description, 
        experience 
      FROM MsTutor 
      WHERE tutorId = $1
    `;
    const tutorDetailsResult = await client.query(tutorDetailsQuery, [tutorId]);

    if (tutorDetailsResult.rows.length === 0) {
      return NextResponse.json({ message: 'Tutor not found' }, { status: 404 });
    }
    const tutor = tutorDetailsResult.rows[0];

    // 2. Fetch tutor's subjects
    const tutorSubjectsQuery = `
      SELECT s.subjectsId, s.subjects 
      FROM Subjects s
      JOIN TutorSubjects ts ON s.subjectsId = ts.subjectsId
      WHERE ts.tutorId = $1
    `;
    const tutorSubjectsResult = await client.query(tutorSubjectsQuery, [tutorId]);
    const subjects = tutorSubjectsResult.rows;

    // 3. Fetch tutor's availability (only the day)
    const tutorAvailabilityQuery = `
      SELECT DISTINCT day
      FROM TutorAvailability 
      WHERE tutorId = $1
      ORDER BY day
    `;
    // Note: 'day' is an INTEGER. You might want to map this to day names (e.g., 0 for Sunday, 1 for Monday) in the frontend.
    const tutorAvailabilityResult = await client.query(tutorAvailabilityQuery, [tutorId]);
    // The result will be an array of objects like [{day: 0}, {day: 1}, ...]
    const availability = tutorAvailabilityResult.rows; 

    // Combine all data
    const profileData = {
      ...tutor,
      subjects,
      availability, // This will now be an array of objects, each with a 'day' property
    };
    console.log(NextResponse.json(profileData))
    return NextResponse.json(profileData, { status: 200 });

  } catch (error) {
    console.error('Error fetching tutor profile:', error);
    const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred';
    return NextResponse.json({ message: 'Error fetching tutor profile', error: errorMessage }, { status: 500 });
  } finally {
    client.release();
  }
}
