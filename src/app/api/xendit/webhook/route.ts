import { NextRequest, NextResponse } from "next/server";
import pool from "@/lib/db";

interface WebhookPayload {
  id: string;
  external_id: string;
  status: "PENDING" | "PAID" | "EXPIRED" | "FAILED";
  // Add other fields you expect in the webhook payload
  [key: string]: string;
}

export async function POST(req: NextRequest) {
  try {
    const webhookToken = process.env.XENDIT_WEBHOOK_VERIFICATION_TOKEN;
    const callbackToken = req.headers.get("x-callback-token");

    if (!webhookToken) {
      return NextResponse.json(
        { error: "Webhook token not configured" },
        { status: 500 }
      );
    }

    const body: WebhookPayload = await req.json();

    // Verify the webhook signature using Xendit's webhook validation
    const isValid = callbackToken === webhookToken;

    if (!isValid) {
      return NextResponse.json(
        { error: "Invalid webhook signature" },
        { status: 401 }
      );
    }

    const { external_id, status } = body;

    try {
      const client = await pool.connect();

      // Directly update the booking status using xenditInvoiceID
      switch (status) {
        case "PAID":
          console.log(`Updating booking with invoice ${external_id} to PAID`);
          await client.query(
            'UPDATE booking SET status = $1 WHERE "xenditInvoiceID" = $2',
            ["CONFIRMED", external_id]
          );
          break;

        case "EXPIRED":
          console.log(
            `Updating booking with invoice ${external_id} to EXPIRED`
          );
          await client.query(
            'UPDATE booking SET status = $1 WHERE "xenditInvoiceID" = $2',
            ["CANCELLED", external_id]
          );
          break;

        case "FAILED":
          console.log(`Updating booking with invoice ${external_id} to FAILED`);
          await client.query(
            'UPDATE booking SET status = $1 WHERE "xenditInvoiceID" = $2',
            ["FAILED", external_id]
          );
          break;

        default:
          console.log(
            `Received unhandled status ${status} for invoice ${external_id}`
          );
      }

      client.release();
    } catch (error) {
      console.error("Error updating booking status:", error);
      return NextResponse.json(
        { error: "Failed to update booking status" },
        { status: 500 }
      );
    }

    return NextResponse.json({ received: true });
  } catch (error) {
    console.error("Webhook error:", error);
    const errorMessage =
      error instanceof Error ? error.message : "An unknown error occurred";
    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
}
