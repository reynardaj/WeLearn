"use client";

import { Button } from "@/components/Buttons";
import ProgressIndicator from "@/components/ProgressIndicator";
import React, { useEffect, useState } from "react";
import { Heading2, Title } from "@/components/Heading";
import { TextMd, TextSm } from "@/components/Text";
import { useRouter } from "next/navigation";
import { getFormData, saveFormData } from "@/utils/localStorage";

interface FormData {
  price: number;
}

export default function SetPricePage() {
  const [formData, setFormData] = useState<FormData>({
    price: 0,
  });
  const [inputValue, setInputValue] = useState(formData.price.toString());

  useEffect(() => {
    const storedData = getFormData();
    const price = storedData?.price ?? 0;
    setFormData({ price });
    setInputValue(price.toString());
  }, []);

  const router = useRouter();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Validate form
    const isValid = formData.price !== 0;

    if (isValid) {
      saveFormData(formData);
      router.push("/tutor-form/step-4");
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = e.target;
    setInputValue(value);

    if (value === "") {
      setFormData((prev) => ({ ...prev, price: 0 }));
    } else {
      const parsedValue = parseInt(value, 10);
      if (!isNaN(parsedValue)) {
        setFormData((prev) => ({ ...prev, price: parsedValue }));
      }
    }
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

        <form onSubmit={handleSubmit} className="space-y-4 mt-6 flex flex-col">
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
                className="w-full p-2 border border-gray-300 rounded-md [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                required
                placeholder="Rp."
                value={inputValue}
                onChange={handleChange}
              />
            </div>
          </div>

          <Button type="submit" className="self-end">
            Continue
          </Button>
        </form>
      </div>
    </div>
  );
}
