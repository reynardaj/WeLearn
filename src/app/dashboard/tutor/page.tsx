"use client";
import { Heading2 } from "@/components/Heading"; 
import { TextMd, TextSm } from "@/components/Text"; 
import DashboardClick from "@/components/tutor-dashboard-performance/DashboardSidebar";
import Calendar from 'react-calendar';
import React , {useState, useEffect} from "react";
import 'react-calendar/dist/Calendar.css';
import AnalyticsTabs from '@/components/tutor-dashboard-performance/AnalyticTab';

interface SummaryStats {
  totalSessions: number;
  totalEarning: number;
  averageRating: number;
  uniqueStudents: number;
}

interface UpcomingSession {
  dateDisplay: string;    // e.g., "Mon, Jun 02"
  startTime: string;      // e.g., "14:00"
  endTime: string;        // e.g., "15:00"
  subject: string;
  tuteeName: string;
}

const toYYYYMMDD = (date: Date): string => {
  return date.toISOString().split('T')[0];
};

export default function Register() {
  const tutorId = "998083f8-869a-44e8-b2eb-798aa9900274";

  const [currentCalendarDate, setCurrentCalendarDate] = useState<Date>(new Date());

  const [summaryStats, setSummaryStats] = useState<SummaryStats | null>(null);
  const [isLoadingStats, setIsLoadingStats] = useState(true);
  const [statsError, setStatsError] = useState<string | null>(null);

  const [upcomingSessions, setUpcomingSessions] = useState<UpcomingSession[]>([]);
  const [isLoadingUpcoming, setIsLoadingUpcoming] = useState(true);
  const [upcomingError, setUpcomingError] = useState<string | null>(null);

  // State for calendar view and session markers
  const [activeCalendarViewDate, setActiveCalendarViewDate] = useState<Date>(new Date());
  const [sessionMarkerDates, setSessionMarkerDates] = useState<string[]>([]);
  const [isLoadingMarkers, setIsLoadingMarkers] = useState(false);

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
        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.message || `Failed to fetch summary stats: ${response.statusText}`);
        }
        const data: SummaryStats = await response.json();
        setSummaryStats(data);
      } catch (err) {
        console.error("Fetch summary stats error:", err);
        setStatsError(err instanceof Error ? err.message : "An unknown error occurred.");
      } finally {
        setIsLoadingStats(false);
      }
    };
    
    const fetchUpcomingSessions = async () => {
      setIsLoadingUpcoming(true);
      setUpcomingError(null);
      try {
        const response = await fetch(`/api/tutor-dashboard/upcomingSession?tutorId=${tutorId}`);
        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.message || `Failed to fetch upcoming sessions: ${response.statusText}`);
        }
        const data: UpcomingSession[] = await response.json();
        setUpcomingSessions(data);
      } catch (err) {
        console.error("Fetch upcoming sessions error:", err);
        setUpcomingError(err instanceof Error ? err.message : "An unknown error occurred.");
      } finally {
        setIsLoadingUpcoming(false);
      }
    };

    fetchSummaryStats();
    fetchUpcomingSessions();

  }, [tutorId]);

   // Effect for fetching calendar session markers when active view changes
  useEffect(() => {
    if (!tutorId || !activeCalendarViewDate) return;

    const year = activeCalendarViewDate.getFullYear();
    const month = activeCalendarViewDate.getMonth() + 1; // getMonth() is 0-indexed

    const fetchCalendarMarkers = async () => {
      setIsLoadingMarkers(true);
      try {
        const response = await fetch(`/api/tutor-dashboard/calenderMark?tutorId=${tutorId}&year=${year}&month=${month}`);
        if (!response.ok) {
          throw new Error('Failed to fetch calendar markers');
        }
        const data: string[] = await response.json();
        setSessionMarkerDates(data);
      } catch (error) {
        console.error("Fetch calendar markers error:", error);
        // Optionally set an error state for markers
      } finally {
        setIsLoadingMarkers(false);
      }
    };

    fetchCalendarMarkers();
  }, [tutorId, activeCalendarViewDate]);

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
              <Heading2 className="h-auto"> {/* Adjusted margin */}
                Analytic Overview
              </Heading2>
              <div className="w-[100%] flex-grow"> {/* Changed h-[95%] to flex-grow */}
                <AnalyticsTabs tutorId={tutorId}/>
              </div>
            </div>
        </div>
      </div>
      <div className="w-[25%] h-[85%] flex flex-col items-center">
        <div className="w-[90%] h-[100%] bg-white rounded-2xl shadow-lg flex flex-col items-center justify-evenly">
          <div className="w-[90%] h-auto flex items-center justify-center">
            <Calendar
              onChange={(value) => setCurrentCalendarDate(value instanceof Date ? value : (value as Date[])[0])} // Handle single date or range
              value={currentCalendarDate}
              className="w-full max-w-sm border-none react-calendar-override"
              prev2Label={null}
              next2Label={null}
              navigationLabel={({ label }) => ( <div className="flex items-center justify-center font-semibold">{label}</div> )}
              prevLabel={ <div className="text-gray-600 flex items-center justify-center">←</div> }
              nextLabel={ <div className="text-gray-600 flex items-center justify-center">→</div> }
              onActiveStartDateChange={({ activeStartDate }) => {
                if (activeStartDate) {
                  setActiveCalendarViewDate(activeStartDate);
                }
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
            <div className="h-[90%] overflow-y-auto no-scrollbar">
              <div className="h-auto w-[100%]">
                {isLoadingUpcoming ? (
                  <div className="p-3 text-center text-gray-500">Loading upcoming sessions...</div>
                ) : upcomingError ? (
                  <div className="p-3 text-center text-red-500">Error: {upcomingError}</div>
                ) : upcomingSessions.length > 0 ? (
                  upcomingSessions.map((session, index) => (
                    <div key={index} className="py-4 border-gray-200 border-b flex justify-between">
                      <div>
                        <TextMd>{session.dateDisplay}</TextMd>
                        <TextSm>{session.startTime} - {session.endTime}</TextSm>
                      </div>
                      <div className="flex items-end flex-col">
                        <TextMd>{session.subject}</TextMd>
                        <TextSm className="text-gray-500">{session.tuteeName}</TextSm>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="p-3 text-center text-gray-500">No upcoming sessions.</div>
                )}
              </div>
            </div>
            
          </div>
        </div>
      </div>
    </div>
  );
}
