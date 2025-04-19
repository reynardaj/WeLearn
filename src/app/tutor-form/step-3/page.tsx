"use client";

import { Button } from "@/components/Buttons";
import ProgressIndicator from "@/components/ProgressIndicator";
import React, { useState } from "react";
import { Heading2, Title } from "@/components/Heading";
import { TextMd, TextSm } from "@/components/Text";
import { useRouter } from "next/navigation";

interface FormData {
  price: string;
}

export default function AboutYouPage() {
  const [formData, setFormData] = useState<FormData>({
    price: "",
  });

  const router = useRouter();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Validate form
    const isValid = Object.values(formData).every(
      (value) => value.trim() !== ""
    );

    if (isValid) {
      // Store form data in localStorage for passing to next step
      localStorage.setItem("tutorFormData", JSON.stringify(formData));
      router.push("/tutor-form/step-4");
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  return (
    <div className="flex justify-center gap-20 items-center w-screen h-screen bg-background">
      <div className="flex flex-col items-start justify-center">
        <Heading2 className="mb-8">Become Tutor</Heading2>
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
              status: "active",
            },
            {
              id: 4,
              title: "Set Availability",
              status: "inactive",
              route: "/tutor-form/step-4",
            },
          ]}
        />
      </div>
      <div className="bg-container text-text px-16 py-12 rounded-lg shadow-md max-w-[50%] w-full h-[90%] flex flex-col">
        <Title>Name Your Price</Title>
        <TextMd>
          Define your pricing structure. Set a rate that reflects your skills
          and experience while keeping it competitive to attract students. You
          can update this later if needed.
        </TextMd>

        <form onSubmit={handleSubmit} className="space-y-4 mt-6">
          <div>
            <label
              htmlFor="price"
              className="block text-sm font-medium text-text mb-1"
            >
              <TextSm>Your Price</TextSm>
            </label>
            <div className="flex">
              <input
                type="number"
                id="price"
                name="price"
                className="w-full p-2 border border-gray-300 rounded-md"
                required
                placeholder="Rp."
                value={formData.price}
                onChange={handleChange}
              />
            </div>
          </div>

          <Button type="submit" className="w-full">
            Continue
          </Button>
        </form>
      </div>
    </div>
  );
}
