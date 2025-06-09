// Your Page (e.g., app/dashboard/page.tsx)
"use client";
import { Heading2 } from "@/components/Heading"; 
import { TextMd, TextSm } from "@/components/Text"; 
import DashboardClick from "@/components/tutor-dashboard/DashboardSidebar";
import Calendar from 'react-calendar';
import React, { useState, useEffect } from "react";
import { useAuth } from "@clerk/nextjs";
import 'react-calendar/dist/Calendar.css';
import AnalyticsTabs from '@/components/tutor-dashboard/AnalyticTab';

interface SummaryStats {
  totalSessions: number;
  totalEarning: number;
  averageRating: number;
  uniqueStudents: number;
}

interface SelectedDaySession {
  dateDisplay: string;
  startTime: string;
  endTime: string;  
  subject: string;
  tuteeName: string;
}

// TIMEZONE FIX: This helper formats a date into YYYY-MM-DD without timezone conversion
const toYYYYMMDD = (date: Date): string => {
  const year = date.getFullYear();
  const month = (date.getMonth() + 1).toString().padStart(2, '0');
  const day = date.getDate().toString().padStart(2, '0');
  return `${year}-${month}-${day}`;
};

// function useTutorData(userId: string | null) {
//   const [tutorId, setTutorId] = useState<string | null>(null);
//   const [isLoading, setIsLoading] = useState(true);
//   const [error, setError] = useState<string | null>(null);

//   useEffect(() => {
//     if (!userId) {
//       setError("User not authenticated");
//       setIsLoading(false);
//       return;
//     }

//     const fetchTutorId = async () => {
//       try {
//         const response = await fetch(`/api/users/tutor/${userId}`);
//         if (!response.ok) {
//           throw new Error('Failed to fetch tutor ID');
//         }
//         const data = await response.json();
//         setTutorId(data.tutorId);
//       } catch (err) {
//         console.error('Error fetching tutor ID:', err);
//         setError('Failed to load tutor data');
//       } finally {
//         setIsLoading(false);
//       }
//     };

//     fetchTutorId();
//   }, [userId]);

//   return { tutorId, isLoading, error };
// }

export default function Register() {
  // Authentication
  // const { userId } = useAuth();
  
  // // Tutor data
  // const { tutorId, isLoading, error } = useTutorData(userId);
  
  // Stats state
  const [summaryStats, setSummaryStats] = useState<SummaryStats | null>(null);
  const [isLoadingStats, setIsLoadingStats] = useState(true);
  const [statsError, setStatsError] = useState<string | null>(null);
  
  // Session list state
  const [selectedDaySessions, setSelectedDaySessions] = useState<SelectedDaySession[]>([]);
  const [isLoadingSelectedDay, setIsLoadingSelectedDay] = useState(false);
  const [selectedDayError, setSelectedDayError] = useState<string | null>(null);
  
  // Calendar state
  const [activeCalendarViewDate, setActiveCalendarViewDate] = useState<Date>(new Date());
  const [sessionMarkerDates, setSessionMarkerDates] = useState<string[]>([]);
  const tutorId="44ea634a-4135-4077-a44f-fff4bb395d88"
  // // Derived state
  // const isAuthenticated = !!userId;
  // const hasTutorData = !!tutorId;


  // // Render loading state
  // if (isLoading) {
  //   return (
  //     <div className="h-screen w-full flex items-center justify-center">
  //       <div>Loading...</div>
  //     </div>
  //   );
  // }

  // // Render error state
  // if (!isAuthenticated) {
  //   return (
  //     <div className="h-screen w-full flex items-center justify-center">
  //       <div className="text-red-500">
  //         User not authenticated. Please log in.
  //       </div>
  //     </div>
  //   );
  // }

  // // Render error state for tutor data
  // if (error || !hasTutorData) {
  //   return (
  //     <div className="h-screen w-full flex items-center justify-center">
  //       <div className="text-red-500">
  //         {error || 'Tutor ID not found. Please ensure you are registered as a tutor.'}
  //       </div>
  //     </div>
  //   );
  // }

  
  // Effect for summary stats
  useEffect(() => {
    if (!tutorId) {
      setIsLoadingStats(false);
      setStatsError("Tutor ID is missing for stats.");
      return;
    }
    const fetchSummaryStats = async () => {
      setIsLoadingStats(true);
      setStatsError(null);
      try {
        const response = await fetch(`/api/tutor-dashboard/statistic?tutorId=${tutorId}`);
        if (!response.ok) throw new Error('Failed to fetch summary stats');
        const data: SummaryStats = await response.json();
        setSummaryStats(data);
      } catch (err) {
        setStatsError(err instanceof Error ? err.message : "An unknown error occurred.");
      } finally {
        setIsLoadingStats(false);
      }
    };
    fetchSummaryStats();
  }, [tutorId]);

  // Effect for fetching calendar session markers when the view (month/year) changes
  useEffect(() => {
    if (!tutorId || !activeCalendarViewDate) return;

    const year = activeCalendarViewDate.getFullYear();
    const month = activeCalendarViewDate.getMonth() + 1;

    const fetchCalendarMarkers = async () => {
      try {
        const response = await fetch(`/api/tutor-dashboard/calenderMark?tutorId=${tutorId}&year=${year}&month=${month}`);
        if (!response.ok) throw new Error('Failed to fetch calendar markers');
        const data: string[] = await response.json();
        setSessionMarkerDates(data);
      } catch (error) {
        console.error("Fetch calendar markers error:", error);
      }
    };
    fetchCalendarMarkers();
  }, [tutorId, activeCalendarViewDate]);

  // Handler for when a user clicks a date on the calendar
  const handleDateClick = async (date: Date) => {
    setSelectedDaySessions([]); // Clear previous sessions
    setIsLoadingSelectedDay(true);
    setSelectedDayError(null);
    const dateString = toYYYYMMDD(date);

    try {
        const response = await fetch(`/api/tutor-dashboard/upcomingSession?tutorId=${tutorId}&date=${dateString}`);
        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.message || 'Failed to fetch sessions for this date.');
        }
        const data: SelectedDaySession[] = await response.json();
        setSelectedDaySessions(data);
    } catch (err) {
        setSelectedDayError(err instanceof Error ? err.message : "An unknown error occurred.");
    } finally {
        setIsLoadingSelectedDay(false);
    }
  };

  // // Render loading state
  // if (isDataLoading) {
  //   return (
  //     <div className="h-screen w-full flex items-center justify-center">
  //       <div>Loading...</div>
  //     </div>
  //   );
  // }

  // // Render error states
  // if (!isAuthenticated) {
  //   return (
  //     <div className="h-screen w-full flex items-center justify-center">
  //       <div className="text-red-500">
  //         User not authenticated. Please log in.
  //       </div>
  //     </div>
  //   );
  // }

  // if (tutorError || !hasTutorData) {
  //   return (
  //     <div className="h-screen w-full flex items-center justify-center">
  //       <div className="text-red-500">
  //         {tutorError || 'Tutor ID not found. Please ensure you are registered as a tutor.'}
  //       </div>
  //     </div>
  //   );
  // }

  return (
    <div className="h-screen w-full flex bg-[#F0FAF9] items-center">
      <div className="w-[15%] h-[85%] flex flex-col items-center">
        <DashboardClick/>
      </div>
      <div className="w-[60%] h-[85%] flex flex-col">
        <div className="w-[100%] h-[100%] bg-white rounded-2xl shadow-lg flex flex-col items-center justify-center overflow-y-auto no-scrollbar">
            <div className="w-[90%] h-auto flex justify-center items-center">
              <div className="w-[25%] h-[100%] flex flex-col justify-center items-center border-r-2 border-[#B8B8B8]">
                <div>Total Sessions</div>
                <div>
                  {isLoadingStats ? "..." : statsError ? "N/A" : summaryStats?.totalSessions ?? '0'}
                </div>
              </div>
              <div className="w-[25%] h-[100%] flex flex-col justify-center items-center border-r-2 border-[#B8B8B8]">
                <div>Total Earning</div>
                <div>
                  {isLoadingStats ? "..." : statsError ? "N/A" : `Rp ${summaryStats?.totalEarning.toLocaleString() ?? '0'}`}
                </div>
              </div>
              <div className="w-[25%] h-[100%] flex flex-col justify-center items-center border-r-2 border-[#B8B8B8]">
                <div>Average Rating</div>
                <div>
                  {isLoadingStats ? "..." : statsError ? "N/A" : summaryStats?.averageRating.toFixed(1) ?? '0.0'}
                  <span>/5</span>
                </div>
              </div>
              <div className="w-[25%] h-[100%] flex flex-col justify-center items-center">
                <div>Unique Students</div>
                <div>
                  {isLoadingStats ? "..." : statsError ? "N/A" : summaryStats?.uniqueStudents ?? '0'}
                </div>
              </div>
            </div>
            
            <div className="w-[90%] h-[85%] flex flex-col justify-between">
              <Heading2 className="h-auto">
                Analytic Overview
              </Heading2>
              <div className="w-[100%] flex-grow">
                <AnalyticsTabs tutorId={tutorId}/>
              </div>
            </div>
        </div>
      </div>
      <div className="w-[25%] h-[85%] flex flex-col items-center">
        {/* --- REVERTED TO YOUR ORIGINAL STRUCTURE AND CLASSES --- */}
        <div className="w-[90%] h-[100%] bg-white rounded-2xl shadow-lg flex flex-col items-center justify-evenly">
          <div className="w-[90%] h-auto flex items-center justify-center">
            <Calendar
              onChange={(value) => {
                const clickedDate = value instanceof Date ? value : (value as Date[])[0];
                if (clickedDate) handleDateClick(clickedDate);
              }}
              value={null}
              className="w-[90%] border-none react-calendar-override"
              prev2Label={null}
              next2Label={null}
              navigationLabel={({ label }) => ( <div className="flex items-center justify-center font-semibold">{label}</div> )}
              prevLabel={ <div className="text-gray-600 flex items-center justify-center">←</div> }
              nextLabel={ <div className="text-gray-600 flex items-center justify-center">→</div> }
              onActiveStartDateChange={({ activeStartDate }) => {
                if (activeStartDate) setActiveCalendarViewDate(activeStartDate);
              }}
              tileContent={({ date, view }) => {
                if (view === 'month') {
                  const dateString = toYYYYMMDD(date);
                  if (sessionMarkerDates.includes(dateString)) {
                    return <div className="session-dot"></div>;
                  }
                }
                return null;
              }}
            />
          </div>
          <div className="w-[90%] h-[45%]">
            <div className="h-[10%] pb-2">
              Upcoming
            </div>
            <div className="h-[90%] w-[100%] overflow-y-auto no-scrollbar">
              {/* --- DYNAMIC SESSION LIST LOGIC --- */}
              {isLoadingSelectedDay ? (
                <div className="p-3 text-center text-gray-500">Loading sessions...</div>
              ) : selectedDayError ? (
                <div className="p-3 text-center text-red-500">Error: {selectedDayError}</div>
              ) : selectedDaySessions.length > 0 ? (
                selectedDaySessions.map((session, index) => (
                  <div key={index} className="py-4 border-b border-gray-200 flex justify-between items-center">
                    <div>
                      <TextMd>{session.subject}</TextMd>
                      <TextSm>{session.startTime} - {session.endTime}</TextSm>
                    </div>
                    <div className="flex items-end flex-col">
                      <TextMd className="text-gray-500">{session.tuteeName}</TextMd>
                    </div>
                  </div>
                ))
              ) : (
                <div className="p-3 text-center text-gray-500">Select a date to see sessions.</div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}