import { NextResponse } from "next/server";

async function createPlan(customerId: string, referenceId: string) {
  const payload = {
    reference_id: referenceId,
    customer_id: customerId,
    recurring_action: "PAYMENT",
    currency: "IDR",
    amount: 50000,
    payment_methods: [],
    schedule: {
      reference_id: referenceId,
      interval: "MONTH",
      interval_count: 1,
      total_recurrence: 12,
      anchor_date: new Date().toISOString(),
      retry_interval: "DAY",
      retry_interval_count: 3,
      total_retry: 2,
      failed_attempt_notifications: [1, 2],
    },
    immediate_action_type: "FULL_AMOUNT",
    notification_config: {
      recurring_created: ["WHATSAPP", "EMAIL"],
      recurring_succeeded: ["WHATSAPP", "EMAIL"],
      recurring_failed: ["WHATSAPP", "EMAIL"],
      locale: "en",
    },
    failed_cycle_action: "STOP",
    payment_link_for_failed_attempt: true,
    metadata: null,
    description: "Tutor Pro Subscription",
    items: [
      {
        type: "DIGITAL_PRODUCT",
        name: "Tutor Pro",
        net_unit_amount: 50000,
        quantity: 1,
        url: "https://www.xendit.co/",
        category: "Education",
        subcategory: "Online Learning",
      },
    ],
    success_return_url: "https://www.xendit.co/successisthesumoffailures",
    failure_return_url: "https://www.xendit.co/failureisthemotherofsuccess",
  };
  const res = await fetch("https://api.xendit.co/recurring/plans", {
    method: "POST",
    body: JSON.stringify(payload),
    headers: {
      Authorization: `Basic ${Buffer.from(
        "xnd_development_xb36gPni9msQuIV505Xn94NQQWJMxIyGoBMU1b31SEpX62HLs44GI0Yut4dkMpB"
      ).toString("base64")}`,
      "Content-Type": "application/json",
    },
  });

  if (!res.ok) {
    throw new Error(`Failed to create plan: ${res.statusText}`);
  }

  return await res.json();
}

export async function GET() {
  try {
    // Create customer
    const customerPayload = {
      reference_id: Date.now().toString(),
      type: "INDIVIDUAL",
      individual_detail: {
        given_names: "John",
        surname: "Doe",
      },
      email: "test@example.com",
      mobile_number: "+628121234567890",
    };

    const customerRes = await fetch("https://api.xendit.co/customers", {
      method: "POST",
      body: JSON.stringify(customerPayload),
      headers: {
        Authorization: `Basic ${Buffer.from(
          process.env.XENDIT_SECRET_KEY + ":"
        ).toString("base64")}`,
        "Content-Type": "application/json",
      },
    });

    if (!customerRes.ok) {
      throw new Error(`Failed to create customer: ${customerRes.statusText}`);
    }

    const customerData = await customerRes.json();

    if (!customerData.id) {
      throw new Error("Failed to create customer: No customer ID returned");
    }

    // Create plan with the new customer
    const planData = await createPlan(
      customerData.id,
      customerPayload.reference_id
    );

    if (!planData.id) {
      throw new Error("Failed to create plan: No plan ID returned");
    }

    // Return the plan data to the client
    return NextResponse.json({
      success: true,
      actions: planData.actions[0].url,
    });
  } catch (error) {
    console.error("Error in Xendit API:", error);
    return NextResponse.json(
      {
        success: false,
        error:
          error instanceof Error ? error.message : "An unknown error occurred",
      },
      { status: 500 }
    );
  }
}
