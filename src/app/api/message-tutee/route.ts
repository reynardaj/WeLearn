import { Pool } from 'pg';
import { NextResponse } from 'next/server';

export const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: { rejectUnauthorized: false },
});

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const convId = searchParams.get("conversationId");
  if (!convId) {
    console.log("⚠️  GET /api/messages missing conversationId");
    return NextResponse.json([], { status: 200 });
  }

  // Pull all messages for that conversation
  const { rows } = await pool.query(
    `SELECT 
       "messageID"   AS "messageID",
       "senderIsTutor",
       content,
       "sentAt"
     FROM "message"
     WHERE "conversationID" = $1
     ORDER BY "sentAt"`,
    [convId]
  );
  return NextResponse.json(rows);
}

export async function POST(req: Request) {
  const {
    conversationId: maybeConv,  // ← accepts optional conversationId
    tutorID,                    // ← needed if maybeConv is null
    tuteeID,                    // ← needed if maybeConv is null
    senderIsTutor,
    content
  } = await req.json();

  let conversationId = maybeConv;
  if (!conversationId) {
    const existing = await pool.query(
      `SELECT "conversationID"
         FROM "conversation"
        WHERE "tutorID" = $1
          AND "tuteeID" = $2;`,
      [tutorID, tuteeID]
    );
    if (existing.rows.length) {
      conversationId = existing.rows[0].conversationID;
    } else {
      const insertRes = await pool.query(
        `INSERT INTO "conversation"("tutorID","tuteeID")
          VALUES ($1, $2)
         RETURNING "conversationID";`,
        [tutorID, tuteeID]
      );
      conversationId = insertRes.rows[0].conversationID;
    }
  }
  
  const { rows } = await pool.query(
    `INSERT INTO "message"
       ("conversationID", "senderIsTutor", content)
     VALUES ($1, $2, $3)
     RETURNING 
       "messageID", "senderIsTutor", content, "sentAt"`,
    [conversationId, senderIsTutor, content]
  );
  
  return NextResponse.json({
    conversationId,
    message: rows[0]
  });
}
