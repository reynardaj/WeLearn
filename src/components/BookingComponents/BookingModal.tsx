// components/BookingModal.tsx
"use client";
import { useEffect, useState } from "react";
import { PaymentRequest } from "@/types/payment";
import { playfair } from "@/lib/fonts";
import WeekDatePicker from "@/components/BookingComponents/DatePicker";
import Picker from "@/components/BookingComponents/ButtonPicker";
import Button from "@mui/material/Button";
import { useAuth } from "@clerk/nextjs";
import { Heading3 } from "../Heading";
import { TextMd, TextSm } from "../Text";

const groupTimes = (times: string[]) => {
  const morning: string[] = [];
  const afternoon: string[] = [];
  const evening: string[] = [];

  times.forEach((time) => {
    const hour = parseInt(time.split(":")[0]);
    if (hour >= 7 && hour < 12) morning.push(time);
    else if (hour >= 12 && hour < 17) afternoon.push(time);
    else if (hour >= 17 && hour <= 21) evening.push(time);
  });

  return { morning, afternoon, evening };
};

export default function BookingModal({
  tutorID,
  onClose,
}: {
  tutorID: string;
  onClose: () => void;
}) {
  const { userId } = useAuth();
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [availableTimes, setAvailableTimes] = useState<string[]>([]);
  const [selectedSubject, setSelectedSubject] = useState<string | null>(null);
  const [selectedTime, setSelectedTime] = useState<string | null>(null);
  const [tutorSubjects, setTutorSubjects] = useState<string[]>([]);

  useEffect(() => {
    if (!tutorID || !selectedDate) return;

    const fetchData = async () => {
      const dateStr = selectedDate.toISOString().split("T")[0];
      const res = await fetch(
        `/api/booking?tutorID=${tutorID}&date=${dateStr}`
      );
      const data = await res.json();
      setAvailableTimes(data.timeSlots || []);
      setTutorSubjects(data.subjects || []);
    };

    fetchData();
  }, [tutorID, selectedDate]);

  const { morning, afternoon, evening } = groupTimes(availableTimes);

  const handleBookingClick = async () => {
    if (!selectedDate || !selectedSubject || !selectedTime) {
      return;
    }

    try {
      // Fetch tutor's price from the API
      const priceResponse = await fetch(`/api/tutor/price?tutorID=${tutorID}`);
      if (!priceResponse.ok) {
        throw new Error('Failed to fetch tutor price');
      }
      const { price } = await priceResponse.json();

      // First, create the booking to get the bookingId
      let tuteeId;
      const response = await fetch(`/api/users/tutee/${userId}`);
      if (!response.ok) {
        throw new Error('Failed to fetch tutee ID');
      }
      const data = await response.json();
      tuteeId = data?.tuteeId;
      if (!tuteeId) {
        throw new Error('Tutee ID not found');
      }

      // Create a temporary booking to get the bookingId
      const bookingRes = await fetch("/api/booking", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          tutorID,
          tuteeId,
          subject: selectedSubject,
          startTime: (() => {
            const [hours, minutes] = selectedTime.split(":").map(Number);
            const startDate = new Date(selectedDate);
            startDate.setHours(hours, minutes, 0, 0);
            const startTime = startDate.toISOString();
            console.log("Calculated start time (ISO):", startTime);
            return startTime;
          })(),
          endTime: (() => {
            const [hours, minutes] = selectedTime.split(":").map(Number);
            const endDate = new Date(selectedDate);
            endDate.setHours(hours, minutes, 0, 0);
            endDate.setHours(endDate.getHours() + 1); // Add 1 hour in local time
            const endTime = endDate.toISOString();
            console.log("Calculated end time (ISO):", endTime);
            return endTime;
          })(),
          xenditInvoiceId: "temp-" + Date.now(), // Temporary ID, will be updated
        }),
      });

      if (!bookingRes.ok) {
        const error = await bookingRes.json();
        throw new Error(error.message || "Failed to create booking");
      }

      const bookingResponse = await bookingRes.json();

      const bookingId =
        bookingResponse.bookingId ||
        bookingResponse.bookingid ||
        bookingResponse.BookingID;

      if (!bookingId) {
        throw new Error("Failed to get booking ID from the server response");
      }

      // Now create the payment with the bookingId
      const paymentRes = await fetch("/api/xendit/create-payment", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          amount: price,
          description: `Tutoring session for ${selectedSubject}`,
          bookingId: bookingId,
        } as PaymentRequest),
      });

      if (!paymentRes.ok) {
        const error = await paymentRes.json();
        throw new Error(error.error || "Failed to create payment");
      }

      const { invoiceUrl, externalId } = await paymentRes.json();

      // Update the booking with the actual xenditInvoiceId
      const updateRes = await fetch(`/api/booking/${bookingId}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          xenditInvoiceId: externalId,
        }),
      });

      if (!updateRes.ok) {
        console.error("Failed to update booking with xendit invoice ID");
        // Continue anyway as the payment was created successfully
      }

      // Redirect to payment page
      window.location.href = invoiceUrl;
    } catch (error: unknown) {
      console.error("Booking error:", error);
      const errorMessage =
        error instanceof Error
          ? error.message
          : "Failed to create booking. Please try again.";
      alert(errorMessage);
    }
  };
  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center"
      style={{ backgroundColor: "rgba(0, 0, 0, 0.6)" }}
    >
      <div className="relative flex flex-col w-[90%] sm:w-[60%] md:w-[50%] lg:w-[40%] xl:w-[30%] max-h-[90vh] overflow-y-auto rounded-2xl bg-[#F0FAF9] p-6 gap-5">
        <button
          onClick={onClose}
          className="absolute top-2 right-3 text-[20px] font-bold cursor-pointer"
        >
          &times;
        </button>

        <Heading3 className="text-center">Book A Session</Heading3>

        <WeekDatePicker
          selectedDate={selectedDate}
          setSelectedDate={setSelectedDate}
        />

        {tutorSubjects.length > 0 && (
          <div>
            <TextMd>Subject</TextMd>
            <Picker
              options={tutorSubjects}
              selected={selectedSubject}
              onSelect={setSelectedSubject}
            />
          </div>
        )}

        {["Morning", "Afternoon", "Evening"].map((label, i) => {
          const slot = [morning, afternoon, evening][i];
          return (
            <div key={label}>
              <TextMd>{label}</TextMd>
              {slot.length > 0 ? (
                <Picker
                  options={slot}
                  selected={selectedTime}
                  onSelect={setSelectedTime}
                />
              ) : (
                <TextSm>No available time slots</TextSm>
              )}
            </div>
          );
        })}

        <Button
          onClick={handleBookingClick}
          variant="outlined"
          sx={{
            fontSize: "12px",
            color: "white",
            borderRadius: "8px",
            backgroundColor: "#1F65A6",
            padding: "8px",
          }}
        >
          Continue
        </Button>
      </div>
    </div>
  );
}
