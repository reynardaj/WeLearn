// app/api/conversation-tutor/route.ts
import { Pool } from 'pg';
import { NextResponse } from 'next/server';

export const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: { rejectUnauthorized: false },
});

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const tutorID = searchParams.get('tutorID');
  if (!tutorID) return NextResponse.json([], { status: 200 });

  const { rows } = await pool.query(
    `SELECT
        c."conversationID" AS "conversationId",
        t.firstname || ' ' || t.lastname AS name,
        'https://placehold.co/100x100/EBF8F8/4A5568?text=' || SUBSTRING(t.firstname, 1, 1) AS profileimg,
        m2."content" AS "lastMessage",
        m2."sentAt" AS "lastMessageAt"
    FROM conversation c
    JOIN tuteeform t ON t.tuteeid = c."tuteeID"
    LEFT JOIN LATERAL (
      SELECT "content", "sentAt"
      FROM "message"
      WHERE "conversationID" = c."conversationID"
      ORDER BY "sentAt" DESC
      LIMIT 1
    ) AS m2 ON true
    WHERE c."tutorID" = $1`,
    [tutorID]
  );

  return NextResponse.json(rows);
}
