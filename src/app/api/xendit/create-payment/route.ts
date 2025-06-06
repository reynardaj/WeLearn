import { Xendit } from 'xendit-node';
import { NextRequest, NextResponse } from 'next/server';
import { CreateInvoiceRequest } from 'xendit-node/invoice/models';

const xendit = new Xendit({
  secretKey: process.env.XENDIT_SECRET_KEY as string,
});

const { Invoice } = xendit;

interface PaymentRequest {
  amount: number;
  description: string;
}

export async function POST(req: NextRequest) {
  try {
    const { amount, description } = (await req.json()) as PaymentRequest;
    
    if (!amount || isNaN(amount)) {
      return NextResponse.json(
        { error: 'Invalid amount provided' },
        { status: 400 }
      );
    }

    const invoiceData: CreateInvoiceRequest = {
      externalId: `invoice-${Date.now()}`,
      amount: Number(amount),
      description: description || 'Payment for WeLearn',
      successRedirectUrl: `${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'}/payment/success`,
      currency: 'IDR',
      customer: {
        givenNames: 'Customer',
        email: 'customer@example.com'
      },
      customerNotificationPreference: {
        invoicePaid: ['email' as const]
      },
      items: [
        {
          name: description || 'Course Access',
          price: Number(amount),
          quantity: 1
        }
      ]
    };

    const response = await Invoice.createInvoice({
      data: invoiceData
    });
    return NextResponse.json(response);
  } catch (error) {
    console.error('Payment error:', error);
    const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred';
    return NextResponse.json(
      { error: errorMessage },
      { status: 500 }
    );
  }
}
