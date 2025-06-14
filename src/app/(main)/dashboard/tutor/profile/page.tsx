"use client";
import { Heading3 } from "@/components/Heading";
import { TextMd } from "@/components/Text";
import DashboardClick from "@/components/tutor-dashboard/DashboardSidebar";
import React, { useState, useEffect } from "react";
import Image from "next/image";
import { useAuth } from "@clerk/nextjs"; // Import Clerk's useAuth hook

// --- Interfaces ---
interface Subject {
  subjectsid: string;
  subjects: string;
}

interface AvailabilityDay {
  day: number;
}

interface TutorProfileData {
  tutorid: string;
  firstname: string;
  lastname: string;
  institution: string | null;
  price: number | null;
  description: string;
  experience: string | null;
  profileimg: string | null;
  subjects: Subject[];
  availability: AvailabilityDay[];
}

interface UpdatePayload {
  tutorId: string;
  firstname?: string;
  lastname?: string;
  description?: string;
}


const getDayName = (dayNumber: number): string => {
  const days = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];
  if (dayNumber >= 1 && dayNumber <= 7) return days[dayNumber - 1];
  return "Unknown Day";
}

export default function ProfilePage() {
  // --- STATE MANAGEMENT ---
  // Clerk Auth State
  const { userId } = useAuth();

  // State for our internal IDs and data
  const [tutorId, setTutorId] = useState<string | null>(null);
  const [profileData, setProfileData] = useState<TutorProfileData | null>(null);
  
  // Combined loading and error states
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // State for managing edits
  const [isEditingName, setIsEditingName] = useState(false);
  const [isEditingDescription, setIsEditingDescription] = useState(false);
  const [editedData, setEditedData] = useState<Partial<TutorProfileData>>({});


  // --- DATA FETCHING ---

  // Step 1: Fetch internal tutorId using the Clerk userId
  useEffect(() => {
    if (!userId) {
      // Still waiting for Clerk to provide userId
      return;
    }
    
    const fetchTutorId = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const response = await fetch(`/api/users/tutor/${userId}`);
        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.error || "You are not registered as a tutor.");
        }
        const data = await response.json();
        setTutorId(data.tutorId); // This will trigger the next useEffect
      } catch (err) {
        setError(err instanceof Error ? err.message : "An unknown error occurred");
        setIsLoading(false); // Stop loading on error
      }
    };

    fetchTutorId();
  }, [userId]);


  // Step 2: Fetch the full profile data once we have the internal tutorId
  useEffect(() => {
    if (!tutorId) {
      // Waiting for the tutorId to be fetched
      return;
    }

    const fetchProfile = async () => {
      // setIsLoading(true) is already set by the previous effect
      setError(null);
      try {
        const response = await fetch(`/api/tutor-dashboard/profiles?tutorId=${tutorId}`);
        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.message || 'Failed to fetch profile');
        }
        const data: TutorProfileData = await response.json();
        setProfileData(data);
        setEditedData(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : "An unknown error occurred.");
      } finally {
        setIsLoading(false); // Final loading state is set here
      }
    };

    fetchProfile();
  }, [tutorId]); // This effect depends on tutorId


  // --- EVENT HANDLERS ---

  const handleEditClick = (section: 'name' | 'description') => {
    setEditedData(profileData || {});
    if (section === 'name') setIsEditingName(true);
    if (section === 'description') setIsEditingDescription(true);
  };

  const handleCancel = () => {
    setIsEditingName(false);
    setIsEditingDescription(false);
    setEditedData(profileData || {});
  };

  const handleSave = async (section: 'name' | 'description') => {
    if (!tutorId) {
      alert("Error: Tutor ID is missing.");
      return;
    }

    const payload: UpdatePayload = { tutorId };
    if (section === 'name') {
      payload.firstname = editedData.firstname;
      payload.lastname = editedData.lastname;
    } else if (section === 'description') {
      payload.description = editedData.description;
    }
    
    try {
      const response = await fetch('/api/tutor-dashboard/profiles', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload)
      });
      if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.message || `Failed to save ${section}`);
      }
      const { updatedProfile } = await response.json();
      
      setProfileData(prevData => ({...(prevData as TutorProfileData), ...updatedProfile}));
      
      setIsEditingName(false);
      setIsEditingDescription(false);

    } catch (err) {
      alert(`Error saving changes: ${err instanceof Error ? err.message : 'Unknown error'}`);
    }
  };
  
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setEditedData(prev => ({ ...prev, [name]: value }));
  };


  // --- RENDER LOGIC ---

  if (isLoading) {
    return (
      <div className="h-screen w-full flex bg-[#F0FAF9] items-center">
        <div className="w-[15%] h-[85%] flex flex-col items-center">
          <DashboardClick/>
        </div>
        <div className="w-[85%] h-[85%] flex flex-col">
          <div className="w-[90%] h-[100%] justify-center bg-white rounded-2xl shadow-lg flex flex-col items-center">
            <TextMd>Loading profile...</TextMd>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="h-screen w-full flex bg-[#F0FAF9] items-center">
        <div className="w-[15%] h-[85%] flex flex-col items-center">
          <DashboardClick/>
        </div>
        <div className="w-[85%] h-[85%] flex flex-col">
          <div className="w-[90%] h-[100%] justify-center bg-white rounded-2xl shadow-lg flex flex-col items-center">
            <TextMd>Error: {error}</TextMd>
          </div>
        </div>
      </div>
    );
  }
  
  if (!profileData) {
      return (
          <div className="h-screen w-full flex bg-[#F0FAF9] items-center">
              <div className="w-[15%] h-[85%] flex flex-col items-center">
                  <DashboardClick/>
              </div>
              <div className="w-[85%] h-[85%] flex flex-col">
                  <div className="w-[90%] h-[100%] justify-center bg-white rounded-2xl shadow-lg flex flex-col items-center">
                      <TextMd>No profile data found.</TextMd>
                  </div>
              </div>
          </div>
      );
  }


  return (
    <div className="h-screen w-full flex bg-[#F0FAF9] items-center">
      <div className="w-[15%] h-[85%] flex flex-col items-center">
        <DashboardClick/>
      </div>
      <div className="w-[85%] h-[85%] flex flex-col">
        <div className="w-[90%] h-[100%] justify-center bg-white rounded-2xl shadow-lg flex flex-col items-center">
          <div className="w-[95%] h-[90%]">
            <div className="h-[50%] w-[100%] flex">
              <div className="w-[23%] h-[90%] rounded-2xl justify-center items-center flex bg-gray-200">
                <Image 
                    src={profileData.profileimg || '/assets/profile.png'}
                    alt={`${profileData.firstname}'s profile`}
                    width={150}
                    height={150}
                    className="object-cover rounded-2xl w-full h-full"
                />
              </div>
              <div className="w-auto h-auto ml-5">
                <div className="flex items-center gap-3 mb-2">
                    {isEditingName ? (
                        <>
                            <input type="text" name="firstname" value={editedData.firstname || ''} onChange={handleInputChange} className="p-1 border rounded" placeholder="First Name"/>
                            <input type="text" name="lastname" value={editedData.lastname || ''} onChange={handleInputChange} className="p-1 border rounded" placeholder="Last Name"/>
                        </>
                    ) : (
                        <Heading3>{profileData.firstname} {profileData.lastname}</Heading3>
                    )}
                    {isEditingName ? (
                         <div className="flex gap-2">
                             <button onClick={() => handleSave('name')} className="text-sm text-green-600 font-semibold">Save</button>
                             <button onClick={handleCancel} className="text-sm text-red-600 font-semibold">Cancel</button>
                         </div>
                    ) : (
                        <button onClick={() => handleEditClick('name')} className="p-1">
                            <Image src="/assets/changes.png" alt="Edit Name" width={16} height={16} />
                        </button>
                    )}
                </div>

                <TextMd className="mb-2">{profileData.experience}</TextMd>
                <div className="flex ">
                  {profileData.subjects && profileData.subjects.length > 0 ? (
                    <TextMd className="mb-2">
                      {profileData.subjects.map(subject => subject.subjects).join(' , ')}
                    </TextMd>
                  ) : (
                    <TextMd className="text-xs inline">No subjects listed.</TextMd>
                  )}
                </div>
                <TextMd className="mb-2">Rp {profileData.price} / hour</TextMd>
                <div className="flex mb-2">
                  {profileData.availability && profileData.availability.length > 0 ? (
                    <TextMd>{profileData.availability.map(availDay => getDayName(availDay.day)).join(' , ')}</TextMd>
                  ) : (
                    <TextMd>Not specified.</TextMd>
                  )}
                </div>
                <TextMd>{profileData.institution}</TextMd>
              </div>
            </div>  
            <div className="h-[50%] w-[100%]">
              <div className="flex items-center gap-3">
                <Heading3>About me</Heading3>
                 {isEditingDescription ? (
                     <div className="flex gap-2">
                         <button onClick={() => handleSave('description')} className="text-sm text-green-600 font-semibold">Save</button>
                         <button onClick={handleCancel} className="text-sm text-red-600 font-semibold">Cancel</button>
                     </div>
                ) : (
                    <button onClick={() => handleEditClick('description')} className="p-1">
                        <Image src="/assets/changes.png" alt="Edit Description" width={16} height={16} />
                    </button>
                )}
              </div>
              {isEditingDescription ? (
                  <textarea name="description" value={editedData.description || ''} onChange={handleInputChange} className="w-full h-24 p-2 border rounded mt-2"/>
              ) : (
                  <TextMd>{profileData.description}</TextMd>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
