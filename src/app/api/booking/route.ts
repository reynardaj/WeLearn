import { NextRequest, NextResponse } from 'next/server';
import { Pool } from 'pg';

const pool = new Pool({  
  connectionString: process.env.DATABASE_URL,  
  ssl: { rejectUnauthorized: false }  
});  

export async function GET(req: NextRequest) {
  const url = new URL(req.url);
  const tutorID = url.searchParams.get('tutorID');
  const dateParam = url.searchParams.get('date');

  if (!tutorID || !dateParam) {
    return NextResponse.json({ error: 'Missing tutorID or date' }, { status: 400 });
  }

  const date = new Date(dateParam);
  const dayOfWeek = date.getDay(); // 0 = Sunday, 1 = Monday, etc.

  try {
    const client = await pool.connect();

    // --- Fetch available time slots ---
    const availabilityRes = await client.query(
      `SELECT startTime, endTime 
       FROM TutorAvailability 
       WHERE tutorID = $1 AND day = $2`,
      [tutorID, dayOfWeek]
    );

    const generateTimeSlots = (start: string, end: string): string[] => {
      const slots: string[] = [];
      let [sh, sm] = start.split(":").map(Number);
      const [eh, em] = end.split(":").map(Number);

      while (sh < eh || (sh === eh && sm < em)) {
        const hour = String(sh).padStart(2, "0");
        const minute = String(sm).padStart(2, "0");
        slots.push(`${hour}:${minute}`);
        sh += 1;
      }

      return slots;
    };

    const allSlots = availabilityRes.rows.flatMap(row =>
      generateTimeSlots(row.starttime, row.endtime)
    );

    // --- Fetch subject names ---
    const subjectRes = await client.query(
      `SELECT s.subjects AS name
       FROM subjects s
       JOIN TutorSubjects ts ON ts.subjectsID = s.subjectsID
       WHERE ts.tutorID = $1`,
      [tutorID]
    );

    const subjects = subjectRes.rows.map(row => row.name);

    client.release();

    return NextResponse.json({ timeSlots: allSlots, subjects });
  } catch (err) {
    console.error('Database error:', err);
    return NextResponse.json({ error: 'Database error' }, { status: 500 });
  }
}
