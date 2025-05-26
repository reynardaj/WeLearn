import { Pool } from 'pg';
import { NextResponse } from 'next/server';

export const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false },
});

export async function GET() {
  const client = await pool.connect();

  try {
    const result = await client.query(`
        SELECT 
            t."tutorid", 
            t."firstname", 
            t."lastname", 
            t."institution", 
            t."price", 
            t."profileimg",
            json_agg(json_build_object(
                'day', a."day",
                'startTime', a."starttime",
                'endTime', a."endtime"
            )) AS availability,
            array_agg(DISTINCT s."name") AS subjects
        FROM "mstutor" t
        LEFT JOIN "tutorsubject" ts ON t."tutorid" = ts."tutorid"
        LEFT JOIN "subject" s ON ts."subjectid" = s."subjectid"
        LEFT JOIN "tutoravailability" a ON t."tutorid" = a."tutorid"
        GROUP BY t."tutorid"
    `);

    return NextResponse.json({ tutors: result.rows }, { status: 200 });
  } catch (error) {
    console.error('Database error:', error);
    return NextResponse.json(
        { error: error instanceof Error ? error.message : 'Unknown error' },
        { status: 500 }
    );
  } finally {
    client.release();
  }
}
