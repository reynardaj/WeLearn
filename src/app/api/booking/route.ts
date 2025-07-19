import { NextRequest, NextResponse } from "next/server";
import { Pool } from "pg";

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false },
});

export async function GET(req: NextRequest) {
  const url = new URL(req.url);
  const tutorID = url.searchParams.get("tutorID");
  const dateParam = url.searchParams.get("date");

  if (!tutorID || !dateParam) {
    return NextResponse.json(
      { error: "Missing tutorID or date" },
      { status: 400 }
    );
  }

  const date = new Date(dateParam);
  const dayOfWeek = date.getDay(); // 0 = Sunday, 1 = Monday, etc.

  try {
    const client = await pool.connect();

    // --- Fetch available time slots ---
    const availabilityRes = await client.query(
      `SELECT startTime, endTime 
       FROM TutorAvailability 
       WHERE tutorID = $1 AND day = $2`,
      [tutorID, dayOfWeek]
    );

    const generateTimeSlots = (start: string, end: string): string[] => {
      const slots: string[] = [];
      const [sh, sm] = start.split(":").map(Number);
      const [eh, em] = end.split(":").map(Number);
      let currentHour = sh;

      while (currentHour < eh || (currentHour === eh && sm < em)) {
        const hour = String(currentHour).padStart(2, "0");
        const minute = String(sm).padStart(2, "0");
        slots.push(`${hour}:${minute}`);
        currentHour += 1;
      }

      return slots;
    };

    const allSlots = availabilityRes.rows.flatMap((row) =>
      generateTimeSlots(row.starttime, row.endtime)
    );

    // --- Fetch subject names ---
    const subjectRes = await client.query(
      `SELECT s.subjects AS name
       FROM subjects s
       JOIN TutorSubjects ts ON ts.subjectsID = s.subjectsID
       WHERE ts.tutorID = $1`,
      [tutorID]
    );

    const subjects = subjectRes.rows.map((row) => row.name);

    client.release();

    return NextResponse.json({ timeSlots: allSlots, subjects });
  } catch (err) {
    console.error("Database error:", err);
    return NextResponse.json({ error: "Database error" }, { status: 500 });
  }
}

interface BookingRequest {
  tutorID: string;
  tuteeId: string;
  subject: string;
  startTime: string;
  endTime: string;
  xenditInvoiceId: string;
}

export async function POST(req: NextRequest) {
  try {
    const { tutorID, tuteeId, subject, startTime, endTime, xenditInvoiceId } =
      (await req.json()) as BookingRequest;

    if (
      !tutorID ||
      !tuteeId ||
      !subject ||
      !startTime ||
      !endTime ||
      !xenditInvoiceId
    ) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }
    console.log("tuteeid route: ", tuteeId);

    const client = await pool.connect();

    try {
      await client.query("BEGIN");

      // Create booking record
      const bookingRes = await client.query(
        `INSERT INTO booking 
         ("BookingID", "SubjectBooked", "StartTime", "EndTime", "tutorID", "tuteeID", "status", "xenditInvoiceID")
         VALUES ($1, $2, $3, $4, $5, $6, 'PENDING_PAYMENT', $7)
         RETURNING *`,
        [
          `book-${Date.now()}`,
          subject,
          new Date(startTime),
          new Date(endTime),
          tutorID,
          tuteeId,
          xenditInvoiceId,
        ]
      );

      await client.query("COMMIT");

      // Return the booking ID with consistent casing
      const booking = bookingRes.rows[0];
      
      return NextResponse.json({
        bookingId: booking.BookingID, // Use the exact case from the database
        status: "PENDING_PAYMENT",
      });
    } catch (error) {
      await client.query("ROLLBACK");
      console.error("Database error during booking creation:", error);
      throw error;
    } finally {
      client.release();
    }
  } catch (error) {
    console.error("Error processing booking request:", error);
    const errorMessage =
      error instanceof Error ? error.message : "Failed to process booking";
    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
}
