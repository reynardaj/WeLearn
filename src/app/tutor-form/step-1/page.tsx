"use client";

import { Button } from "@/components/Buttons";
import ProgressIndicator from "@/components/ProgressIndicator";
import React, { useEffect, useState } from "react";
import { Heading2, Title } from "@/components/Heading";
import { TextMd } from "@/components/Text";
import { useRouter } from "next/navigation";
import InstituteCombobox from "@/components/InstituteCombobox";
import { getFormData, saveFormData } from "@/utils/localStorage";

interface FormData {
  firstName: string;
  lastName: string;
  email: string;
  institute: string;
}

export default function AboutYouPage() {
  const [formData, setFormData] = useState<FormData>({
    firstName: "",
    lastName: "",
    email: "",
    institute: "",
  });

  const router = useRouter();
  useEffect(() => {
    const storedData = getFormData();
    setFormData({
      firstName: storedData.firstName,
      lastName: storedData.lastName,
      email: storedData.email,
      institute: storedData.institute,
    });
  }, []);
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Validate form
    const isValid = Object.values(formData).every(
      (value) => value.trim() !== ""
    );
    saveFormData(formData);
    if (isValid) {
      // Store form data in localStorage for passing to next step
      localStorage.setItem("tutorFormData", JSON.stringify(formData));
      router.push("/tutor-form/step-2");
    }
  };

  const handleChange = (
    e:
      | React.ChangeEvent<HTMLInputElement>
      | { target: { name: string; value: string } }
  ) => {
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
            { id: 1, title: "About You", status: "active" },
            {
              id: 2,
              title: "Set Up Profile",
              status: "inactive",
              route: "/tutor-form/step-2",
            },
            {
              id: 3,
              title: "Set Price",
              status: "inactive",
              route: "/tutor-form/step-3",
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
        <Title>About You</Title>
        <TextMd>
          Tell us a little about yourself! Provide your name, email, and
          institute details to get started. This helps us create a personalized
          experience for you.
        </TextMd>

        <form onSubmit={handleSubmit} className="space-y-4 mt-6">
          <div>
            <label
              htmlFor="firstName"
              className="block text-sm font-medium text-text mb-1"
            >
              First Name
            </label>
            <input
              type="text"
              id="firstName"
              name="firstName"
              className="w-full p-2 border border-gray-300 rounded-md "
              required
              value={formData.firstName || ""}
              onChange={handleChange}
            />
          </div>

          <div>
            <label
              htmlFor="lastName"
              className="block text-sm font-medium text-text mb-1"
            >
              Last Name
            </label>
            <input
              type="text"
              id="lastName"
              name="lastName"
              className="w-full p-2 border border-gray-300 rounded-md "
              required
              value={formData.lastName || ""}
              onChange={handleChange}
            />
          </div>

          <div>
            <label
              htmlFor="email"
              className="block text-sm font-medium text-text mb-1"
            >
              Email
            </label>
            <input
              type="email"
              id="email"
              name="email"
              className="w-full p-2 border border-gray-300 rounded-md "
              required
              value={formData.email}
              onChange={handleChange}
            />
          </div>

          <div>
            <label
              htmlFor="institute"
              className="block text-sm font-medium text-text mb-1"
            >
              Institute
            </label>
            <InstituteCombobox
              value={formData.institute}
              onChange={(val: string) =>
                handleChange({ target: { name: "institute", value: val } })
              }
              required
            />
          </div>

          <div className="flex justify-end mt-auto">
            <Button
              type="submit"
              data-type="primary"
              className="cursor-pointer"
            >
              Next
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
