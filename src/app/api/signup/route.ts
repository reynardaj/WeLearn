import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import pool from "@/lib/db";

export async function POST() {
  try {
    // Get the authenticated user from Clerk
    const { userId } = await auth();

    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Insert the user ID into the database
    await pool.query(
      "INSERT INTO users (userid) VALUES ($1) ON CONFLICT (userid) DO NOTHING",
      [userId]
    );

    return NextResponse.json(
      { success: true, message: "User stored successfully" },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error storing user:", error);
    return NextResponse.json(
      { error: "Failed to store user" },
      { status: 500 }
    );
  }
}
