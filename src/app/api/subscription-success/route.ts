import { NextRequest, NextResponse } from "next/server";
import pool from "@/lib/db";
export async function POST(req: NextRequest) {
  const { tutorId } = await req.json();

  if (!tutorId) {
    return NextResponse.json({ error: "tutorId is required" }, { status: 400 });
  }

  const client = await pool.connect();
  try {
    await client.query(
      `UPDATE "mstutor" SET "isPro" = true WHERE "tutorid" = $1`,
      [tutorId]
    );

    return NextResponse.json({ message: "Tutor marked as pro successfully" }, { status: 200 });
  } catch (error) {
    console.error("Error marking tutor as pro:", error);
    return NextResponse.json(
      { error: "An error occurred while marking tutor as pro" },
      { status: 500 }
    );
  } finally {
    client.release();
  }
}
