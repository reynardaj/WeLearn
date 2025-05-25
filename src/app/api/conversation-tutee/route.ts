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
        m2."content" AS "lastMessage",
        m2."sentAt" AS "lastMessageAt"
    FROM conversation c
    JOIN mstutor t ON t.tutorid = c."tutorID"
    LEFT JOIN LATERAL (
      SELECT "content", "sentAt"
      FROM "message"
      WHERE "conversationID" = c."conversationID"
      ORDER BY "sentAt" DESC
      LIMIT 1
    ) AS m2 ON true
    WHERE c."tuteeID" = $1`,
    [tuteeID]
  );

  return NextResponse.json(rows);
}

export async function POST(req: Request) {
  const { tutorID, tuteeID } = await req.json();

  const { rows } = await pool.query(
    `INSERT INTO "conversation"("tutorID","tuteeID")
      VALUES ($1,$2)
    ON CONFLICT ON CONSTRAINT uniq_conv_pair
      DO UPDATE SET "tuteeID" = EXCLUDED."tuteeID"  -- no-op update
    RETURNING "conversationID";`,
    [tutorID, tuteeID]
  );
  const conversationId = rows[0].conversationID;

  // fetch & return the contact snippet
  const contactRes = await pool.query(
    `SELECT
       c."conversationID"            AS "conversationId",
       t."firstname" || ' ' || t."lastname" AS name,
       (
         SELECT m.content
           FROM "message" m
          WHERE m."conversationID" = c."conversationID"
            AND m."senderIsTutor" = true
          ORDER BY m."sentAt" DESC
          LIMIT 1
       ) AS "lastMessage"
     FROM "conversation" c
     JOIN "mstutor"    t
       ON t."tutorid" = c."tutorID"
    WHERE c."conversationID" = $1;`,
    [conversationId]
  );

  return NextResponse.json(contactRes.rows[0]);
}