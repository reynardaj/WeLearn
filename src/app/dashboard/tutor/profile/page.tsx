"use client";
import { Heading3 } from "@/components/Heading"; // Assuming these exist
import { TextMd } from "@/components/Text"; // Assuming this exists
import DashboardClick from "@/components/tutor-dashboard-performance/DashboardSidebar"; // Assuming this exists
import React, { useState, useEffect } from "react";
// import Image from "next/image"; // For displaying profile image

// Define an interface for the expected profile data structure
interface Subject {
  subjectsid: string;
  subjects: string;
}

interface AvailabilityDay {
  day: number; // 1 for Monday, 2 for Tuesday, etc.
}

interface TutorProfileData {
  tutorid: string;
  firstname: string;
  lastname: string;
  institution: string | null;
  price: number | null;
  description: string | null;
  experience: string | null;
  subjects: Subject[];
  availability: AvailabilityDay[];
}

// Updated helper function to map day number to day name
// Assumes dayNumber: 1 = Monday, 2 = Tuesday, ..., 7 = Sunday
const getDayName = (dayNumber: number): string => {
  const days = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];
  if (dayNumber >= 1 && dayNumber <= 7) {
    return days[dayNumber - 1];
  }
  return "Unknown Day";
}

export default function Profile() {
  const [profileData, setProfileData] = useState<TutorProfileData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchProfile = async () => {
      setIsLoading(true);
      setError(null);
      // --- IMPORTANT: You need to get the actual tutorId ---
      const currentTutorId = "998083f8-869a-44e8-b2eb-798aa9900274"; // <<<< REPLACE THIS

      if (!currentTutorId) {
        setError("Tutor ID is not available or placeholder is still in use. Please set a valid Tutor ID.");
        setIsLoading(false);
        console.warn("Placeholder tutorId is being used. Please replace it with actual logic to fetch the tutorId.");
        return; 
      }

      try {
        const response = await fetch(`/api/tutor-dashboard/profiles?tutorId=${currentTutorId}`);
        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.message || `Failed to fetch profile: ${response.statusText} (status: ${response.status})`);
        }
        const data: TutorProfileData = await response.json();
        console.log("Fetched Profile Data:", JSON.stringify(data, null, 2)); 
        // You can specifically log the subjects array:
        console.log("Subjects Array:", data.subjects);
        setProfileData(data);
      } catch (err) {
        console.error("Fetch error:", err);
        setError(err instanceof Error ? err.message : "An unknown error occurred while fetching profile data.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchProfile();
  }, []);

  // 1. Keep your isLoading check
  if (isLoading) {
    return (
      <div className="h-screen w-full flex bg-[#F0FAF9] items-center">
        <div className="w-[15%] h-[85%] flex flex-col items-center">
          <DashboardClick/>
        </div>
        <div className="w-[85%] h-[85%] flex flex-col">
          <div className="w-[90%] h-[100%] justify-center bg-white rounded-2xl shadow-lg flex flex-col items-center">
            <TextMd>Loading profile...</TextMd> {/* Loading message */}
          </div>
        </div>
      </div>
    );
  }

  // 2. Keep your error check
  if (error) {
    return (
      <div className="h-screen w-full flex bg-[#F0FAF9] items-center">
        <div className="w-[15%] h-[85%] flex flex-col items-center">
          <DashboardClick/>
        </div>
        <div className="w-[85%] h-[85%] flex flex-col">
          <div className="w-[90%] h-[100%] justify-center bg-white rounded-2xl shadow-lg flex flex-col items-center">
            <TextMd>Error: {error}</TextMd> {/* Error message */}
          </div>
        </div>
      </div>
    );
  }

  // Using your original JSX structure and populating with profileData
  return (
    <div className="h-screen w-full flex bg-[#F0FAF9] items-center">
      <div className="w-[15%] h-[85%] flex flex-col items-center">
        <DashboardClick/>
      </div>
      <div className="w-[85%] h-[85%] flex flex-col">
        <div className="w-[90%] h-[100%] justify-center bg-white rounded-2xl shadow-lg flex flex-col items-center">
          <div className="w-[95%] h-[90%]">
            <div className="h-[50%] w-[100%] flex">
              <div className="w-[23%] h-[90%] rounded-2xl justify-center items-center flex bg-[#D9D9D9]">
                image
              </div>
              <div className="w-auto h-[90%] ml-5">
                <Heading3 className="mb-2">{profileData?.firstname} {profileData?.lastname}</Heading3>
                <TextMd className="mb-2">{profileData?.experience}</TextMd>
                <div className="flex ">
                  {profileData?.subjects && profileData.subjects.length > 0 ? (
                    <TextMd className="mb-2">
                      {profileData.subjects.map(subject => subject.subjects).join(' , ')}
                    </TextMd>
                  ) : (
                    <TextMd className="text-xs inline">No subjects listed.</TextMd>
                  )}
                </div>
                <TextMd className="mb-2">Rp {profileData?.price} / hour</TextMd>
                <div className="flex mb-2">
                  {profileData?.availability && profileData.availability.length > 0 ? (
                    <TextMd>{profileData.availability.map(availDay => getDayName(availDay.day)).join(' , ')}</TextMd>
                  ) : (
                    <TextMd>Not specified.</TextMd>
                  )}
                </div>
                <TextMd>{profileData?.institution}</TextMd>
              </div>
            </div>  
            <div className="h-[50%] w-[100%]">
              <Heading3>About me</Heading3>
              <TextMd>{profileData?.description}</TextMd>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
