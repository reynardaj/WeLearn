import { Pool } from 'pg';
import { NextResponse } from 'next/server';

export const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: { rejectUnauthorized: false },
});

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const tuteeID = searchParams.get('tuteeID');
  if (!tuteeID) return NextResponse.json([], { status: 200 });

  const { rows } = await pool.query(
    `SELECT
        c."conversationID" AS "conversationId",
        t.firstname || ' ' || t.lastname AS name,
        (SELECT content
            FROM message m
            WHERE m."conversationID" = c."conversationID"
            ORDER BY "sentAt" DESC
            LIMIT 1) AS "lastMessage"
    FROM conversation c
    JOIN mstutor t ON t.tutorid = c."tutorID"
    WHERE c."tuteeID" = $1
    ORDER BY c."conversationID"`,
    [tuteeID]
  );

  return NextResponse.json(rows);
}
