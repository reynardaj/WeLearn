import { NextRequest, NextResponse } from 'next/server';
import { Pool } from 'pg';

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false,
  },
});

// --- GET Request (Updated to fetch profileimg) ---
export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const tutorId = searchParams.get('tutorId');

  if (!tutorId) {
    return NextResponse.json({ message: 'tutorId is required' }, { status: 400 });
  }

  const client = await pool.connect();

  try {
    const tutorDetailsQuery = `
      SELECT 
        tutorid, 
        firstname, 
        lastname, 
        institution, 
        price, 
        description, 
        experience,
        profileimg -- **ADDED THIS LINE**
      FROM MsTutor 
      WHERE tutorid = $1
    `;
    const tutorDetailsResult = await client.query(tutorDetailsQuery, [tutorId]);

    if (tutorDetailsResult.rows.length === 0) {
      return NextResponse.json({ message: 'Tutor not found' }, { status: 404 });
    }
    const tutor = tutorDetailsResult.rows[0];

    // ... (rest of your GET logic for subjects and availability remains the same) ...
    
    // Fetch tutor's subjects
    const tutorSubjectsQuery = `
      SELECT s.subjectsId, s.subjects 
      FROM Subjects s
      JOIN TutorSubjects ts ON s.subjectsId = ts.subjectsId
      WHERE ts.tutorId = $1
    `;
    const tutorSubjectsResult = await client.query(tutorSubjectsQuery, [tutorId]);
    const subjects = tutorSubjectsResult.rows;

    // Fetch tutor's availability
    const tutorAvailabilityQuery = `
      SELECT DISTINCT day
      FROM TutorAvailability 
      WHERE tutorId = $1
      ORDER BY day
    `;
    const tutorAvailabilityResult = await client.query(tutorAvailabilityQuery, [tutorId]);
    const availability = tutorAvailabilityResult.rows; 

    // Combine all data
    const profileData = {
      ...tutor,
      subjects,
      availability,
    };
    
    return NextResponse.json(profileData, { status: 200 });

  } catch (error) {
    console.error('Error fetching tutor profile:', error);
    const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred';
    return NextResponse.json({ message: 'Error fetching tutor profile', error: errorMessage }, { status: 500 });
  } finally {
    client.release();
  }
}

// --- POST Request (New method to handle updates) ---
export async function POST(req: NextRequest) {
    const body = await req.json();
    const { tutorId, firstname, lastname, description } = body;

    if (!tutorId) {
        return NextResponse.json({ message: 'tutorId is required' }, { status: 400 });
    }

    const client = await pool.connect();
    try {
        let query;
        let queryParams;

        // Determine if we are updating name, description, or both
        if (firstname !== undefined && lastname !== undefined) {
            query = `UPDATE mstutor SET firstname = $1, lastname = $2 WHERE tutorid = $3 RETURNING *;`;
            queryParams = [firstname, lastname, tutorId];
        } else if (description !== undefined) {
            query = `UPDATE mstutor SET description = $1 WHERE tutorid = $2 RETURNING *;`;
            queryParams = [description, tutorId];
        } else {
            return NextResponse.json({ message: 'No valid fields to update' }, { status: 400 });
        }

        const result = await client.query(query, queryParams);

        if (result.rows.length === 0) {
            return NextResponse.json({ message: 'Tutor not found' }, { status: 404 });
        }

        return NextResponse.json({ message: 'Profile updated successfully', updatedProfile: result.rows[0] }, { status: 200 });

    } catch (error) {
        console.error('Error updating tutor profile:', error);
        const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred';
        return NextResponse.json({ message: 'Error updating tutor profile', error: errorMessage }, { status: 500 });
    } finally {
        client.release();
    }
}