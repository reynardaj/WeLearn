import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    console.log("Xendit webhook received");
    console.log(JSON.stringify(body, null, 2));

    // Add your webhook processing logic here
    // For example, you can access the token if needed:
    const token = process.env.XENDIT_WEBHOOK_VERIFICATION_TOKEN;
    const signature = request.headers.get("x-callback-token");
    if (!signature || signature !== token) {
      return NextResponse.json(
        { error: "Invalid or missing callback token" },
        { status: 403 }
      );
    }
    return NextResponse.json({ received: true }, { status: 200 });
  } catch (error) {
    console.error("Webhook error:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
