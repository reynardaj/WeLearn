"use client";
import * as React from "react";
import { useUser } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import { completeOnboarding } from "./_actions";
import { Heading3 } from "@/components/Heading";
import { TextMd } from "@/components/Text";

export default function RoleSelector() {
  const [error, setError] = React.useState("");
  const { user } = useUser();
  const router = useRouter();

  const handleRoleSelect = async (role: "mentor" | "mentee") => {
    console.log(`Selecting role: ${role}`);
    try {
      // First, store the user ID
      const signupResponse = await fetch("/api/signup", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (!signupResponse.ok) {
        console.error("Failed to complete signup:", signupResponse.status);
        throw new Error("Failed to complete signup");
      }

      console.log("Signup successful, completing onboarding...");
      // Then complete the onboarding
      const onboardingRes = await completeOnboarding(role);

      if (onboardingRes?.message) {
        console.log("Onboarding complete, reloading user and redirecting...");
        await user?.reload();
        router.push(role === "mentor" ? "/tutor-form" : "/tutee-form");
      }

      if (onboardingRes?.error) {
        setError(onboardingRes.error);
        console.error("Failed to complete onboarding:", onboardingRes.error);
      }
    } catch (err) {
      console.error("Error during signup/onboarding:", err);
      setError("An error occurred during signup. Please try again.");
    }
  };

  return (
    <div className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-50">
      <div className="bg-[#f1fdfc] p-8 rounded-2xl shadow-2xl w-[400px] relative">
        <button
          onClick={() => router.push("/")}
          className="absolute top-4 right-4 text-gray-500 hover:text-gray-700 text-2xl"
        >
          &times;
        </button>
        <Heading3 className="text-center mb-4">Select your role</Heading3>
        <div className="space-y-6">
          <button
            className="flex items-center justify-center gap-3 w-full px-6 py-4 rounded-xl bg-white border hover:shadow-lg text-lg font-semibold"
            onClick={() => handleRoleSelect("mentor")}
          >
            🎓 <TextMd>Tutor</TextMd>
          </button>
          <button
            className="flex items-center justify-center gap-3 w-full px-6 py-4 rounded-xl bg-white border hover:shadow-lg text-lg font-semibold"
            onClick={() => handleRoleSelect("mentee")}
          >
            👤 <TextMd>Tutee</TextMd>
          </button>
        </div>
        {error && (
          <p className="text-red-600 mt-6 text-center text-base">
            Error: {error}
          </p>
        )}
      </div>
    </div>
  );
}
