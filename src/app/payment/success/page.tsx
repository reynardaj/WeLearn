'use client';
import { Button } from "@/components/button";
import { TextMd, TextSm } from "@/components/Text";
import { Heading3, Heading4 } from "@/components/Heading";

export default function PaymentSuccess() {
  // This would typically come from your booking context or API
  const bookingDetails = {
    className: "Introduction to Algebra",
    tutorName: "John Doe",
    dateTime: new Date("2025-06-14T15:00:00+07:00"),
  };

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      timeZoneName: 'short',
    }).format(date);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
      <div className="max-w-md w-full space-y-6 p-8 bg-white rounded-lg shadow-md">
        <div className="text-center">
          <div className="text-primary text-6xl mb-4">✓</div>
          <Heading3 className="text-gray-900 mb-2">Payment Successful!</Heading3>
          <TextMd className="text-gray-600">
            Thank you for your booking. Here are your class details:
          </TextMd>
        </div>
        
        <div className="mt-6 border-t border-gray-200 pt-6">
          <Heading4 className="pb-4">Booking Summary</Heading4>
          <div className="space-y-2 text-gray-700">
            <div>
              <TextSm className="font-medium">Class:</TextSm>
              <TextSm>{bookingDetails.className}</TextSm>
            </div>
            <div>
              <TextSm className="font-medium">Tutor:</TextSm>
              <TextSm>with {bookingDetails.tutorName}</TextSm>
            </div>
            <div>
              <TextSm className="font-medium">Date & Time:</TextSm>
              <TextSm>{formatDate(bookingDetails.dateTime)}</TextSm>
            </div>
          </div>
        </div>
        <Button variant="primary" className="w-full ">
          Go to Session
        </Button>
      </div>
    </div>
  );
}
