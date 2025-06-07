import { NextRequest, NextResponse } from "next/server";
import { Pool } from "pg";

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false },
});

interface UpdateBookingRequest {
  xenditInvoiceId: string;
}

export async function PATCH(
  req: NextRequest,
  context: { params: { id: string } }
) {
  // Await the params to ensure they're resolved
  const { id: bookingId } = await Promise.resolve(context.params);
  
  if (!bookingId) {
    return NextResponse.json(
      { error: "Booking ID is required" },
      { status: 400 }
    );
  }

  try {
    const { xenditInvoiceId } = (await req.json()) as UpdateBookingRequest;

    if (!xenditInvoiceId) {
      return NextResponse.json(
        { error: "xenditInvoiceId is required" },
        { status: 400 }
      );
    }

    const client = await pool.connect();

    try {
      await client.query("BEGIN");

      // Update the booking with the xenditInvoiceId
      const updateRes = await client.query(
        `UPDATE booking 
         SET "xenditInvoiceID" = $1
         WHERE "BookingID" = $2
         RETURNING *`,
        [xenditInvoiceId, bookingId]
      );

      if (updateRes.rowCount === 0) {
        await client.query("ROLLBACK");
        return NextResponse.json(
          { error: "Booking not found" },
          { status: 404 }
        );
      }

      await client.query("COMMIT");

      return NextResponse.json({
        success: true,
        booking: updateRes.rows[0],
      });
    } catch (error) {
      await client.query("ROLLBACK");
      console.error("Database error during booking update:", error);
      throw error;
    } finally {
      client.release();
    }
  } catch (error) {
    console.error("Error processing booking update:", error);
    const errorMessage =
      error instanceof Error ? error.message : "Failed to update booking";
    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
}
export async function GET(
  req: NextRequest,
  context: { params: { id: string } }
) {
  const { id: bookingId } = await Promise.resolve(context.params);

  if (!bookingId) {
    return NextResponse.json(
      { error: "Booking ID is required" },
      { status: 400 }
    );
  }

  try {
    const client = await pool.connect();

    try {
      const result = await client.query(
        `SELECT 
          b."BookingID" as "bookingId",
          b."SubjectBooked" as "subjectBooked",
          b."StartTime" as "startTime",
          b."EndTime" as "endTime",
          b."status",
          b."xenditInvoiceID" as "xenditInvoiceId",
          t."firstname" || ' ' || t."lastname" AS "tutorName",
          t."profileimg" as "tutorImage"
        FROM booking b
        JOIN "mstutor" t ON b."tutorID" = t."tutorid"
        WHERE b."BookingID" = $1`,
        [bookingId]
      );

      if (result.rows.length === 0) {
        return NextResponse.json(
          { error: "Booking not found" },
          { status: 404 }
        );
      }

      const booking = result.rows[0];
      return NextResponse.json(booking);
    } catch (error) {
      console.error("Database error:", error);
      return NextResponse.json(
        { error: "Failed to fetch booking" },
        { status: 500 }
      );
    } finally {
      client.release();
    }
  } catch (error) {
    console.error("Error connecting to database:", error);
    return NextResponse.json(
      { error: "Database connection error" },
      { status: 500 }
    );
  }
}