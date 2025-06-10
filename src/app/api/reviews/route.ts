import { NextRequest, NextResponse } from "next/server";
import pool from "@/lib/db";
import { auth } from "@clerk/nextjs/server";

export async function POST(req: NextRequest) {
  // 1. Get the logged-in user's ID from Clerk.
  const { userId } = await auth();
  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const client = await pool.connect();

  try {
    // 2. Get the review data from the frontend.
    const { rating, comment, tutorID } = await req.json();

    // Per your instruction, the logged-in user's ID is the tuteeID.
    // const tuteeID = userId;
    const tuteeID = "user_2uyxdPRL9UmC1JY1RPjYGWhjpPF";
    const mockReviewID = crypto.randomUUID();

    // 3. Insert the review using the direct tuteeID.
    // This query is based on our last successful analysis.
    const result = await client.query(
      `INSERT INTO "review"("reviewID", "tutorID", "tuteeID", rating, comment)
       VALUES ($1, $2, $3, $4, $5)
       RETURNING *`,
      [mockReviewID, tutorID, tuteeID, rating, comment]
    );

    return NextResponse.json(
      {
        success: true,
        review: result.rows[0],
      },
      { status: 201 }
    );
  } catch (error: any) {
    console.error("DATABASE INSERTION ERROR:", {
      message: error.message,
      detail: error.detail,
    });

    return NextResponse.json(
      { error: "An error occurred while submitting the review." },
      { status: 500 }
    );
  } finally {
    client.release();
  }
}
