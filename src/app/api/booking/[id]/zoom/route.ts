import { NextRequest, NextResponse } from "next/server";
import { ZoomAPI } from "@/lib/zoom";
import { Pool } from "pg";

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false },
});

export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const bookingId = params.id;
  if (!bookingId) {
    return NextResponse.json({ error: "Missing bookingId" }, { status: 400 });
  }

  let client;
  try {
    client = await pool.connect();

    // 1) pull out the existing row
    const bkRes = await client.query(
      `SELECT "SubjectBooked", "StartTime", "EndTime"
       FROM "booking"
       WHERE "BookingID" = $1`,
      [bookingId]
    );
    if (bkRes.rowCount === 0) {
      return NextResponse.json({ error: "Booking not found" }, { status: 404 });
    }

    const { SubjectBooked, StartTime, EndTime } = bkRes.rows[0];
    // 2) compute duration if you don’t have a Duration column
    const start = new Date(StartTime);
    const end = new Date(EndTime);
    const duration = Math.ceil((end.getTime() - start.getTime()) / 60000);

    // 3) spin up the Zoom meeting
    const zoom = ZoomAPI.getInstance();
    const meeting = await zoom.createMeeting({
      topic: SubjectBooked,
      start_time: start.toISOString(),
      duration,
      type: 2,
      timezone: "Asia/Jakarta",
    });

    // 4) grab the URLs
    const joinUrl = meeting.join_url;
    const startUrl = meeting.start_url;

    // 5) persist them
    await client.query(
      `UPDATE "booking"
         SET "Join_URL" = $1,
             "Start_URL" = $2
       WHERE "BookingID" = $3`,
      [joinUrl, startUrl, bookingId]
    );

    return NextResponse.json(
      { join_url: joinUrl, start_url: startUrl },
      { status: 200 }
    );
  } catch (err: any) {
    console.error("🔥 Error in /api/booking/[id]/zoom:", err);
    // if it’s a Zoom‐side error we can forward it:
    const message =
        err.message ||
        (await request
            .text()
            .catch(() => "Unknown server error"));
    return NextResponse.json({ error: message }, { status: 500 });
  } finally {
    if (client) client.release();
  }
}
