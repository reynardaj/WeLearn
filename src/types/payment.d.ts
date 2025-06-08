export interface PaymentRequest {
  amount: number;
  description: string;
  bookingId?: string;
}
