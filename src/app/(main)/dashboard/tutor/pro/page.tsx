"use client";
import { Heading2, Heading3 } from "@/components/Heading"; // Assuming these exist
import { TextMd, TextSm } from "@/components/Text"; // Assuming this exists
import DashboardClick from "@/components/tutor-dashboard/DashboardSidebar"; // Assuming this exists
import React, { useState,useEffect } from "react";
import { useAuth } from "@clerk/nextjs";
// import React, { useState, useEffect } from "react";
import Image from "next/image"; // For displaying profile image

export default function ProPage() {
  const { userId } = useAuth(); 
  
  // State to hold the internal tutorId from your database
  const [tutorId, setTutorId] = useState<string | null>(null);
  
  // State for loading and errors related to fetching the ID
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const handleSubscribe = async () => {
    const response = await fetch('/api/xendit/subscribe', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      setError('Failed to create subscription');
      return;
    }

    const { invoiceUrl } = await response.json();
    window.location.href = invoiceUrl;
    
  }

  useEffect(() => {
    // Only run this if the Clerk userId is available
    if (!userId) {
        setIsLoading(false);
        // This isn't an error, just waiting for auth
        return;
    }

    async function fetchTutorId() {
      setIsLoading(true);
      setError(null);
      try {
        const response = await fetch(`/api/users/tutor/${userId}`);
        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.error || "Couldn't load tutor profile.");
        }
        const data = await response.json();
        setTutorId(data.tutorId); // Set the fetched tutorId into state
      } catch (err) {
        console.error(err);
        setError(err instanceof Error ? err.message : "An unknown error occurred");
      } finally {
        setIsLoading(false);
      }
    }

    fetchTutorId();
  }, [userId]); // This effect runs whenever the userId changes

  if (isLoading) {
    return <div className="flex h-screen w-full items-center justify-center">Loading user data...</div>;
  }
  if (error) {
    return <div className="flex h-screen w-full items-center justify-center text-red-500">Error: {error}</div>;
  }
  // If the tutorId is still not found after loading, it means they are not a tutor
  if (!tutorId) {
      return <div className="flex h-screen w-full items-center justify-center">You are not registered as a tutor.</div>
  }

  return (
    <div className="h-screen w-full flex bg-[#F0FAF9] items-center">
      <div className="w-[15%] h-[85%] flex flex-col items-center">
        <DashboardClick/>
      </div>
      <div className="w-[75%] h-[85%] flex flex-col justify-center items-center">
        <Heading2 className="pb-4">Choose your plan</Heading2>
        <div className="w-[70%] h-[85%] flex justify-between">
          <div className="w-[45%] h-[100%] justify-center rounded-2xl flex flex-col items-center shadow-lg bg-white">
            <Heading3 className="h-[12%]">Free</Heading3>
            <div className="h-auto w-[80%] pb-6 flex justify-center border-b-2 b-black">
              <Heading3>Rp. 0/</Heading3>
              <TextMd className="flex items-end">mo</TextMd>
            </div>
            <div className="flex h-[60%] w-[80%] pt-6">
              <div className="mr-2">
                <Image 
                  src={'/assets/Check.png'}
                  alt={`v`}
                  width={30}
                  height={30}
                />
              </div>
              <TextMd>Basic profile visibility</TextMd>
            </div>
          </div>
          <div className="w-[45%] h-[100%] justify-center rounded-2xl flex flex-col items-center shadow-lg bg-white">
            <Heading3 className="h-[12%]">Pro</Heading3>
            <div className="h-auto w-[80%] pb-6 flex justify-center border-b-2 b-black">
              <Heading3>Rp. 50.000/</Heading3>
              <TextMd className="flex items-end">mo</TextMd>
            </div>
            <div className="flex flex-col justify-between items-center pt-6 h-[60%] w-[80%]">
              <div className="w-full flex">
                <div className="w-[15%] mr-2">
                  <Image 
                    src={'/assets/Check.png'}
                    alt={`v`}
                    width={30}
                    height={30}
                  />
                </div>
                <div>
                  <TextMd>Enhanced profile visibility with priority listing</TextMd>
                </div>
              </div>
              <button onClick={() => handleSubscribe()} className="cursor-pointer h-[15%] w-[70%] flex justify-center items-center bg-[#1F65A6] rounded-lg">
                <TextSm className="text-white">Choose plan</TextSm>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
