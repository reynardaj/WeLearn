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
            COALESCE(r_stats.avg_rating, 0)::real AS rating,
            json_agg(json_build_object(
                'day', a."day",
                'startTime', a."starttime",
                'endTime', a."endtime"
            )) AS availability,
            array_agg(DISTINCT s."subjects") AS subjects
        FROM "mstutor" t

        LEFT JOIN (
          SELECT
            "tutorID",
            AVG("rating") AS avg_rating
          FROM "review"
          GROUP BY "tutorID"
        ) AS r_stats
          ON r_stats."tutorID" = t."tutorid"

        LEFT JOIN "tutorsubjects" ts ON t."tutorid" = ts."tutorid"
        LEFT JOIN "subjects" s ON ts."subjectsid" = s."subjectsid"
        LEFT JOIN "tutoravailability" a ON t."tutorid" = a."tutorid"
        GROUP BY 
          t."tutorid",
          r_stats.avg_rating
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
