import { Xendit } from 'xendit-node';
import { NextRequest, NextResponse } from 'next/server';

const xendit = new Xendit({
  secretKey: process.env.XENDIT_SECRET_KEY as string,
});

interface WebhookPayload {
  id: string;
  external_id: string;
  status: 'PENDING' | 'PAID' | 'EXPIRED' | 'FAILED';
  // Add other fields you expect in the webhook payload
  [key: string]: any;
}

export async function POST(req: NextRequest) {
  try {
    const webhookToken = process.env.XENDIT_WEBHOOK_VERIFICATION_TOKEN;
    const callbackToken = req.headers.get('x-callback-token');
    
    if (!webhookToken) {
      return NextResponse.json(
        { error: 'Webhook token not configured' },
        { status: 500 }
      );
    }

    const body: WebhookPayload = await req.json();
    
    // Verify the webhook signature using Xendit's webhook validation
    // Note: Xendit's Node.js SDK doesn't expose verifyCallbackSignature directly
    // We'll implement a basic token comparison as a fallback
    // In production, consider using Xendit's webhook signature verification
    const isValid = callbackToken === webhookToken;

    if (!isValid) {
      return NextResponse.json(
        { error: 'Invalid webhook signature' },
        { status: 401 }
      );
    }

    const { external_id, status } = body;
    
    // Handle different payment statuses
    switch (status) {
      case 'PAID':
        console.log(`Payment ${external_id} is PAID`);
        // Update your database here
        break;
      case 'EXPIRED':
        console.log(`Payment ${external_id} has EXPIRED`);
        break;
      case 'FAILED':
        console.log(`Payment ${external_id} has FAILED`);
        break;
    }

    return NextResponse.json({ received: true });
  } catch (error) {
    console.error('Webhook error:', error);
    const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred';
    return NextResponse.json(
      { error: errorMessage },
      { status: 500 }
    );
  }
}
