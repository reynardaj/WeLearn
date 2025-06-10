"use client";
import { TextMd, TextLg } from "@/components/Text"; // Assuming this exists
import DashboardClick from "@/components/tutor-dashboard/DashboardSidebar"; // Assuming this exists
import React, { useState, useEffect } from "react";
// import Image from "next/image"; // For displaying profile image
import EarningOverview from "@/components/tutor-dashboard/EarningOverview";
import { useAuth } from "@clerk/nextjs";

export default function FinancePage() {
  const [totalEarning, setTotalEarning] = useState<number | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const { userId } = useAuth(); 

  // State to hold the internal tutorId from your database
    const [tutorId, setTutorId] = useState<string | null>(null);
  
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

  useEffect(() => {
    if (!tutorId) {
      setError("Tutor ID is not available.");
      setIsLoading(false);
      return;
    }

    const fetchTotalEarning = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const response = await fetch(
          `/api/tutor-dashboard/earning/total?tutorId=${tutorId}`
        );
        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.message || "Failed to fetch total earning");
        }
        const data = await response.json();
        setTotalEarning(data.totalEarning);
      } catch (err) {
        console.error("Fetch total earning error:", err);
        setError(
          err instanceof Error ? err.message : "An unknown error occurred."
        );
      } finally {
        setIsLoading(false);
      }
    };

    fetchTotalEarning();
  }, [tutorId]);
  
  
  if (isLoading) {
    return <div className="flex h-screen w-full items-center justify-center">Loading user data...</div>;
  }else if (!tutorId) {
    return <div className="flex h-screen w-full items-center justify-center">You are not registered as a tutor.</div>
  }else if (error) {
    return <div className="flex h-screen w-full items-center justify-center">{error}</div>;
  }
  // If the tutorId is still not found after loading, it means they are not a tutor
  

  return (
    <div className="h-screen w-full flex bg-[#F0FAF9] items-center">
      <div className="w-[15%] h-[85%] flex flex-col items-center">
        <DashboardClick />
      </div>
      <div className="w-[85%] h-[85%] flex flex-col ">
        <div className="w-[90%] h-[100%] justify-center rounded-2xl shadow-lg flex flex-col items-center bg-white">
          <div className="w-[95%] h-auto pb-4">
            {" "}
            {/* Use w-full */}
            <TextLg className="font-semibold">Total Earning</TextLg>
            <TextMd className="text-xl font-bold">
              {isLoading
                ? "Loading..."
                : error
                ? "Error"
                : `Rp. ${totalEarning?.toLocaleString() ?? 0}`}
            </TextMd>
          </div>
          <div className="w-[95%] h-[80%] flex flex-col">
            {" "}
            {/* Use flex-grow */}
            <TextLg className="pb-4">Earning Overview</TextLg>
            <div className="w-full overflow-y-auto no-scrollbar">
              {" "}
              {/* This div will give height to EarningOverview */}
              <EarningOverview tutorId={tutorId} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
