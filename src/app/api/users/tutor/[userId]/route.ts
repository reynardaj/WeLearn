import { NextResponse } from "next/server";
import { Pool } from "pg";

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false },
});

export async function GET(
  request: Request,
  { params }: { params: { userId: string } }
) {
  const { userId } = params;

  if (!userId) {
    return NextResponse.json(
      { error: "User ID is required" }, 
      { status: 400 }
    );
  }

  try {
    const client = await pool.connect();

    // Query to get tutor ID using user ID
    const result = await client.query(
      `SELECT tutorid FROM users WHERE userid = $1`,
      [userId]
    );

    client.release();

    if (result.rows.length === 0) {
      return NextResponse.json(
        { error: "Tutor not found" }, 
        { status: 404 }
      );
    }

    return NextResponse.json({ 
      tutorId: result.rows[0].tutorid 
    });
  } catch (error) {
    console.error("Error fetching tutor ID:", error);
    return NextResponse.json(
      { error: "Failed to fetch tutor ID" },
      { status: 500 }
    );
  }
}
