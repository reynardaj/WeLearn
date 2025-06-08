// app/api/message-tutor/route.ts
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
    return NextResponse.json([], { status: 200 });
  }

  const { rows } = await pool.query(
    `SELECT 
        "messageID" AS "messageID",
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
    conversationId,
    senderIsTutor,
    content
  } = await req.json();

  if (!conversationId || senderIsTutor === undefined || !content) {
      return NextResponse.json({ message: 'Missing required fields' }, { status: 400 });
  }
  
  const { rows } = await pool.query(
    `INSERT INTO "message"
        ("conversationID", "senderIsTutor", content)
       VALUES ($1, $2, $3)
       RETURNING 
        "messageID", "senderIsTutor", content, "sentAt"`,
    [conversationId, senderIsTutor, content]
  );
  
  return NextResponse.json(rows[0]);
}