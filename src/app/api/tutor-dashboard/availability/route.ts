import { NextRequest, NextResponse } from 'next/server';
import { Pool } from 'pg';

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false },
});

// --- GET Request: Fetch existing availability ---
export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const tutorId = searchParams.get('tutorId');

  if (!tutorId) {
    return NextResponse.json({ message: 'tutorId is required' }, { status: 400 });
  }

  const client = await pool.connect();
  try {
    const query = `
      SELECT availabilityid, day, TO_CHAR(starttime, 'HH24:MI') as starttime, TO_CHAR(endtime, 'HH24:MI') as endtime
      FROM TutorAvailability
      WHERE tutorid = $1
      ORDER BY day, starttime;
    `;
    const result = await client.query(query, [tutorId]);
    return NextResponse.json(result.rows, { status: 200 });
  } catch (error) {
    console.error('Error fetching availability:', error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    return NextResponse.json({ message: 'Error fetching availability', error: errorMessage }, { status: 500 });
  } finally {
    client.release();
  }
}

// --- POST Request: Save new availability ---
export async function POST(req: NextRequest) {
  const body = await req.json();
  const { tutorId, availability } = body;

  if (!tutorId || !availability) {
    return NextResponse.json({ message: 'tutorId and availability data are required' }, { status: 400 });
  }

  const client = await pool.connect();
  try {
    // Start a transaction
    await client.query('BEGIN');

    // First, delete all existing availability for this tutor.
    // This is simpler than trying to update/insert/delete individual slots.
    await client.query('DELETE FROM TutorAvailability WHERE tutorid = $1', [tutorId]);

    // Then, insert the new availability slots
    for (const slot of availability) {
      if (slot.day !== null && slot.starttime && slot.endtime) {
        const insertQuery = `
          INSERT INTO TutorAvailability (availabilityid, tutorid, day, starttime, endtime)
          VALUES (gen_random_uuid(), $1, $2, $3, $4);
        `;
        await client.query(insertQuery, [tutorId, slot.day, slot.starttime, slot.endtime]);
      }
    }

    // Commit the transaction
    await client.query('COMMIT');

    return NextResponse.json({ message: 'Availability saved successfully' }, { status: 200 });

  } catch (error) {
    // If anything fails, roll back the transaction
    await client.query('ROLLBACK');
    console.error('Error saving availability:', error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    return NextResponse.json({ message: 'Error saving availability', error: errorMessage }, { status: 500 });
  } finally {
    client.release();
  }
}