"use client";
import { Button } from "@/components/button";
import { TextMd, TextSm } from "@/components/Text";
import { Heading3, Heading4 } from "@/components/Heading";
import { useEffect, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";

interface BookingDetails {
  className: string;
  tutorName: string;
  dateTime: Date;
  status?: string;
  joinUrl?: string;
  startUrl?: string;
}

export default function PaymentSuccess() {
  const searchParams = useSearchParams();
  const bookingId = searchParams.get("bookingId");
  const [bookingDetails, setBookingDetails] = useState<BookingDetails | null>(
    null
  );
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isGeneratingLink, setIsGeneratingLink] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const fetchBookingDetails = async () => {
      if (!bookingId) {
        setError("No booking ID provided");
        setIsLoading(false);
        return;
      }

      try {
        const response = await fetch(`/api/booking/${bookingId}`);
        if (!response.ok) {
          throw new Error("Failed to fetch booking details");
        }
        const data = await response.json();
        setBookingDetails({
          className: data.subjectBooked || "Tutoring Session",
          tutorName: data.tutorName || "Your Tutor",
          dateTime: new Date(data.startTime),
          status: data.status,
        });
      } catch (err) {
        console.error("Error fetching booking details:", err);
        setError(
          "Failed to load booking details. Please check your booking history."
        );
      } finally {
        setIsLoading(false);
      }
    };

    fetchBookingDetails();
  }, [bookingId]);

  // New effect: once bookingDetails is loaded and we don’t yet have URLs, generate them
  useEffect(() => {
  if (bookingDetails && bookingId && !bookingDetails.joinUrl) {
    setIsGeneratingLink(true);
    (async () => {
      try {
        const res = await fetch(`/api/booking/${bookingId}/zoom`, {
          method: "POST",
        });

        if (!res.ok) {
          const text = await res.text();
          console.error(
            "🚨 /zoom endpoint returned",
            res.status,
            text
          );
          throw new Error("Zoom link generation failed");
        }

        const data = await res.json();
        setBookingDetails((b) =>
          b
            ? {
                ...b,
                joinUrl: data.join_url,
                startUrl: data.start_url,
              }
            : b
        );
      } catch (err) {
        console.error("Zoom link generation error:", err);
      } finally {
        setIsGeneratingLink(false);
      }
    })();
  }
}, [bookingDetails, bookingId]);

const handleJoin = () => {
    if (!bookingDetails?.joinUrl) return;
    window.open(bookingDetails.joinUrl, "_blank");
    router.push("/tutor-listing"); 
  };

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat("en-US", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      timeZoneName: "short",
    }).format(date);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
        <div className="max-w-md w-full p-8 bg-white rounded-lg shadow-md text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary mx-auto mb-4"></div>
          <Heading3 className="text-gray-900 mb-2">
            Loading your booking details...
          </Heading3>
        </div>
      </div>
    );
  }

  if (error || !bookingDetails) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
        <div className="max-w-md w-full p-8 bg-white rounded-lg shadow-md text-center">
          <div className="text-red-500 text-4xl mb-4">!</div>
          <Heading3 className="text-gray-900 mb-4">Error</Heading3>
          <TextMd className="text-gray-600 mb-6">
            {error || "Unable to load booking details."}
          </TextMd>
          <a
            href="/bookings"
            className="inline-block bg-primary text-white px-4 py-2 rounded hover:bg-primary-dark transition-colors"
          >
            View My Bookings
          </a>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
      <div className="max-w-md w-full space-y-6 p-8 bg-white rounded-lg shadow-md">
        <div className="text-center">
          <div className="text-primary text-6xl mb-4">✓</div>
          <Heading3 className="text-text mb-2">
            {bookingDetails.status === "PENDING_PAYMENT"
              ? "Booking Created!"
              : "Payment Successful!"}
          </Heading3>
          <TextMd className="text-text">
            Thank you for your booking. Here are your class details
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
        <Button 
          variant="primary" 
          className="w-full" 
          onClick={handleJoin}
          disabled={isGeneratingLink}
        >
          {isGeneratingLink ? "Generating link..." : "Go To Session"}
        </Button>
      </div>
    </div>
  );
}
