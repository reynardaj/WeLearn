import { NextResponse } from "next/server";
import { Pool } from "pg";

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false },
});

export async function GET(
  request: Request,
  { params }: { params: Promise<{ userId: string }> }
) {
  const { userId } = await params;

  if (!userId) {
    return NextResponse.json({ error: "User ID is required" }, { status: 400 });
  }

  try {
    const client = await pool.connect();

    // Query to get tutee ID using user ID
    const result = await client.query(
      `SELECT tuteeid FROM users WHERE userid = $1`,
      [userId]
    );

    client.release();

    if (result.rows.length === 0) {
      return NextResponse.json({ error: "Tutee not found" }, { status: 404 });
    }

    return NextResponse.json({ tuteeId: result.rows[0].tuteeid });
  } catch (error) {
    console.error("Error fetching tutee ID:", error);
    return NextResponse.json(
      { error: "Failed to fetch tutee ID" },
      { status: 500 }
    );
  }
}
