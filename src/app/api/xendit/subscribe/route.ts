import { NextRequest, NextResponse } from "next/server";
import { Xendit } from "xendit-node";

const xendit = new Xendit({
  secretKey: process.env.XENDIT_SECRET_KEY as string,
});

// Using the Invoice client for subscription as per Xendit's SDK structure
const { Invoice  } = xendit;

export async function POST() {
  try {

    const now = new Date();
    const anchorDate = new Date(now);
    anchorDate.setDate(now.getDate() + 1); // Set anchor date to tomorrow

    const data = {
      reference_id: `ref-${Date.now()}`,
      externalId: `invoice-${Date.now()}`,
      recurring_action: "PAYMENT",
      currency: "IDR",
      amount: 50000,
      schedule: {
        reference_id: `test-${Date.now()}`,
        interval: "MONTH",
        interval_count: 1,
        total_recurrence: 6,
        anchor_date: anchorDate.toISOString(),
        retry_interval: "DAY",
        retry_interval_count: 1,
        total_retry: 3,
        failed_attempt_notifications: [1, 3],
      },
      notification_config: {
        locale: "en",
        recurring_created: ["WHATSAPP", "EMAIL"],
        recurring_succeeded: ["WHATSAPP", "EMAIL"],
        recurring_failed: ["WHATSAPP", "EMAIL"],
      },
      failed_cycle_action: "STOP",
      immediate_action_type: "FULL_AMOUNT",
      payment_link_for_failed_attempt: true,
      description: "Pro Tutor Subscription",
      successRedirectUrl: `${
        process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000"
      }/subscription/success`,
      failureRedirectUrl: `${
        process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000"
      }/dashboard/tutor`,
    };

    // Using the Invoice client's createInvoice method for subscription
    const response = await Invoice.createInvoice({
      data,
    });
    return NextResponse.json(response, {
      status: 200,
      headers: {
        "Content-Type": "application/json",
      },
    });
  } catch (error) {
    console.error("Error creating subscription:", error);
    return NextResponse.json(
      { error: "Failed to create subscription" },
      { status: 500 }
    );
  }
}
