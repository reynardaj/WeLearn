"use client";
import { Button } from "@/components/Buttons";
import ProgressIndicator from "@/components/ProgressIndicator";
import React, { useEffect, useState } from "react";
import { Heading2, Title } from "@/components/Heading";
import { TextMd } from "@/components/Text";
import { useRouter } from "next/navigation";
import { getFormData } from "@/utils/localStorage";

// Define interfaces
interface TimeSlot {
  from: string;
  to: string;
}

interface FormData {
  availability: {
    monday: TimeSlot[];
    tuesday: TimeSlot[];
    wednesday: TimeSlot[];
    thursday: TimeSlot[];
    friday: TimeSlot[];
    saturday: TimeSlot[];
    sunday: TimeSlot[];
  };
}

// Array of days for mapping
const days: (keyof FormData["availability"])[] = [
  "monday",
  "tuesday",
  "wednesday",
  "thursday",
  "friday",
  "saturday",
  "sunday",
];

// Pre-generate time options (0:00 to 23:00)
const timeOptions = Array.from({ length: 24 }).map((_, i) => `${i}:00`);

// TimeSlotInput Component
interface TimeSlotInputProps {
  day: keyof FormData["availability"];
  index: number;
  slot: TimeSlot;
  onChange: (
    day: keyof FormData["availability"],
    index: number,
    field: "from" | "to",
    value: string
  ) => void;
}

function TimeSlotInput({ day, index, slot, onChange }: TimeSlotInputProps) {
  return (
    <div className="flex items-center space-x-2">
      <div>
        <span className="text-xs mb-1 block">From</span>
        <select
          className="border border-gray-300 rounded-md p-2"
          value={slot.from}
          onChange={(e) => onChange(day, index, "from", e.target.value)}
        >
          <option value="">Select time</option>
          {timeOptions.map((time) => (
            <option key={time} value={time}>
              {time}
            </option>
          ))}
        </select>
      </div>
      <span className="mt-6">→</span>
      <div>
        <span className="text-xs mb-1 block">To</span>
        <select
          className="border border-gray-300 rounded-md p-2"
          value={slot.to}
          onChange={(e) => onChange(day, index, "to", e.target.value)}
        >
          <option value="">Select time</option>
          {timeOptions.map((time) => (
            <option key={time} value={time}>
              {time}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
}

// Main Component
export default function SetAvailabilityPage() {
  const [formData, setFormData] = useState<FormData>({
    availability: {
      monday: [{ from: "9:00", to: "17:00" }],
      tuesday: [{ from: "9:00", to: "17:00" }],
      wednesday: [{ from: "9:00", to: "17:00" }],
      thursday: [{ from: "9:00", to: "17:00" }],
      friday: [{ from: "9:00", to: "17:00" }],
      saturday: [],
      sunday: [],
    },
  });

  const [selectedDays, setSelectedDays] = useState({
    monday: true,
    tuesday: true,
    wednesday: true,
    thursday: true,
    friday: true,
    saturday: false,
    sunday: false,
  });
  const router = useRouter();

  // Handle day selection toggle
  const handleDaySelection = (day: keyof typeof selectedDays) => {
    setSelectedDays((prev) => {
      const newSelectedDays = { ...prev, [day]: !prev[day] };
      if (newSelectedDays[day] && formData.availability[day].length === 0) {
        setFormData((prev) => ({
          ...prev,
          availability: {
            ...prev.availability,
            [day]: [{ from: "", to: "" }],
          },
        }));
      }
      return newSelectedDays;
    });
  };

  // Handle time slot changes
  const handleTimeChange = (
    day: keyof FormData["availability"],
    index: number,
    field: "from" | "to",
    value: string
  ) => {
    setFormData((prev) => {
      const updatedSlots = [...prev.availability[day]];
      updatedSlots[index] = { ...updatedSlots[index], [field]: value };
      return {
        ...prev,
        availability: {
          ...prev.availability,
          [day]: updatedSlots,
        },
      };
    });
  };

  // Add a new time slot for a day
  const addMoreTimeSlot = (day: keyof FormData["availability"]) => {
    setFormData((prev) => ({
      ...prev,
      availability: {
        ...prev.availability,
        [day]: [...prev.availability[day], { from: "", to: "" }],
      },
    }));
  };
  const emptyAvailability = {
    monday: [],
    tuesday: [],
    wednesday: [],
    thursday: [],
    friday: [],
    saturday: [],
    sunday: [],
  };
  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const finalAvailability = days.reduce((acc, day) => {
      if (selectedDays[day]) {
        acc[day] = formData.availability[day].filter(
          (slot) => slot.from && slot.to
        );
      }
      return acc;
    }, {} as Partial<FormData["availability"]>);

    const mergedAvailability = { ...emptyAvailability, ...finalAvailability };

    // Retrieve all previous data from localStorage using getFormData helper
    const previousData = getFormData();

    // Merge previous data with current availability
    const submissionData = {
      ...previousData,
      availability: mergedAvailability,
    };

    try {
      const response = await fetch("/api/tutor-form/submit", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(submissionData),
      });
      if (!response.ok) {
        throw new Error("Failed to submit form");
      }
      // Optionally clear localStorage after successful submission
      localStorage.removeItem("tutorFormData");
      router.push("/tutor-form/complete");
    } catch (error) {
      console.error("Error submitting form:", error);
    }
  };

  return (
    <div className="flex justify-center gap-20 items-center w-screen h-screen bg-background">
      <div className="flex flex-col items-start justify-center">
        <Heading2 className="hidden md:block mb-8">Become Tutor</Heading2>
        <ProgressIndicator
          steps={[
            {
              id: 1,
              title: "About You",
              status: "done",
              route: "/tutor-form/step-1",
            },
            {
              id: 2,
              title: "Set Up Profile",
              status: "done",
              route: "/tutor-form/step-2",
            },
            {
              id: 3,
              title: "Set Price",
              status: "done",
              route: "/tutor-form/step-3",
            },
            { id: 4, title: "Set Availability", status: "active" },
          ]}
        />
      </div>
      <div className="min-w-[70%] md:min-w-0 bg-container text-text px-16 py-12 rounded-lg shadow-md max-w-[50%] w-full h-[90%] flex flex-col overflow-y-scroll">
        <Title>Set Availability</Title>
        <TextMd className="mb-6">
          Choose the days and time slots when you're available for tutoring.
          Setting clear availability ensures smooth scheduling and better time
          management.
        </TextMd>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <TextMd className="mb-4">Availability</TextMd>
            {days.map((day) => (
              <div key={day} className="mb-4">
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id={day}
                    checked={selectedDays[day]}
                    onChange={() => handleDaySelection(day)}
                    className="mr-2 h-4 w-4 accent-primary"
                  />
                  <label htmlFor={day} className="text-sm font-medium">
                    {day.charAt(0).toUpperCase() + day.slice(1)}
                  </label>
                </div>
                {selectedDays[day] &&
                  formData.availability[day].map((slot, index) => (
                    <div key={`${day}-${index}`} className="ml-6 mt-2">
                      <TimeSlotInput
                        day={day}
                        index={index}
                        slot={slot}
                        onChange={handleTimeChange}
                      />
                      {index === formData.availability[day].length - 1 && (
                        <button
                          type="button"
                          className="text-text text-xs mt-2"
                          onClick={() => addMoreTimeSlot(day)}
                        >
                          Add More
                        </button>
                      )}
                    </div>
                  ))}
              </div>
            ))}
          </div>
          <div className="flex justify-end">
            <Button type="submit" className="">
              Continue
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
