// components/SessionsSection.tsx
"use client"; // Required for hooks like useState and useEffect

import React, { useState, useEffect } from 'react';
import { TextLg, TextMd, TextSm } from "@/components/Text"; // Assuming TextMd and TextSm might be useful

// Interface for a single session item
interface Session {
  date: string;         // "YYYY-MM-DD"
  starttime: string;    // "HH24:MI"
  endtime: string;      // "HH24:MI"
  subject: string;
  tuteefirstname: string;
  tuteelastname: string;
  price: number;
}

// Props for the SessionsSection component, if you need to pass tutorId, for example
interface SessionsSectionProps {
  tutorId: string; // It's better to pass tutorId as a prop
}

const SessionsSection: React.FC<SessionsSectionProps> = ({ tutorId }) => {
  const [sessionsData, setSessionsData] = useState<Session[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  useEffect(() => {
    const fetchSessionHistory = async () => {
      if (!tutorId) {
        setError("Tutor ID is not available. Cannot fetch session history.");
        setIsLoading(false);
        console.warn("Tutor ID is missing in SessionsSection.");
        return;
      }

      setIsLoading(true);
      setError(null);
      try {
        const response = await fetch(`/api/tutor-dashboard/session?tutorId=${tutorId}`);
        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.message || `Failed to fetch session history: ${response.statusText} (status: ${response.status})`);
        }
        const data: Session[] = await response.json();
        setSessionsData(data);
      } catch (err) {
        console.error("Fetch session history error:", err);
        setError(err instanceof Error ? err.message : "An unknown error occurred while fetching session history.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchSessionHistory();
  }, [tutorId]); // Re-fetch if tutorId changes

  // Pagination logic
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentSessions = sessionsData.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(sessionsData.length / itemsPerPage);

  const handleNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };

  const handlePreviousPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  if (isLoading) {
    return (
      <div className="w-full h-[100%] mt-2 p-4 flex justify-center items-center">
        <TextLg>Loading session history...</TextLg>
      </div>
    );
  }

  if (error) {
    return (
      <div className="w-full h-[100%] mt-2 p-4 text-red-500">
        <TextLg>Error loading sessions:</TextLg>
        <TextMd>{error}</TextMd>
        <button 
          onClick={() => { // Simple retry button
            if (tutorId) { // Ensure tutorId is present before retrying
                const fetchSessionHistory = async () => {
                    setIsLoading(true);
                    setError(null);
                    try {
                        const response = await fetch(`/api/tutor-dashboard/session?tutorId=${tutorId}`);
                        if (!response.ok) {
                        const errorData = await response.json();
                        throw new Error(errorData.message || `Failed to fetch session history: ${response.statusText} (status: ${response.status})`);
                        }
                        const data: Session[] = await response.json();
                        setSessionsData(data);
                    } catch (err) {
                        console.error("Fetch session history error:", err);
                        setError(err instanceof Error ? err.message : "An unknown error occurred while fetching session history.");
                    } finally {
                        setIsLoading(false);
                    }
                };
                fetchSessionHistory();
            } else {
                 setError("Tutor ID is still not available. Cannot retry.");
            }
          }}
          className="mt-2 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
        >
          Try Again
        </button>
      </div>
    );
  }

  return (
    <div className="w-full h-[100%] mt-2">
      {/* Session part */}
      <div className="h-[10%] flex justify-between">
        <div className="flex items-center ">
          <TextLg>Session History</TextLg>
        </div>
        <div className="w-[45%] flex items-center justify-around text-base text-gray-600">
          <div className="flex items-center w-[40%]">
            <input type="date" id="startDate" className="p-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 w-[100%]"/>
          </div>
          <div className="">to</div>
          <div className="flex items-center w-[40%]">
            <input type="date" id="endDate" className="p-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 w-[100%]"/>
          </div>
        </div>
      </div>

      <div className="h-[90%] w-full mt-2 text-black">
        {/* Header Row */}
        <div className='h-[15%] w-[100%] flex justify-between'>
          <div className='h-[100%] w-[22.5%] flex items-center'>Date</div>
          <div className='h-[100%] w-[22.5%] flex items-center'>Time</div>
          <div className='h-[100%] w-[20%] flex items-center'>Subject</div>
          <div className='h-[100%] w-[25%] flex items-center'>Tutee</div>
          <div className='h-[100%] w-[15%] flex items-center'>Earning</div>
        </div>

        {/* Data Rows */}
        <div className='h-[70%]'> {/* Ensure a minimum height for the data area */}
          {currentSessions.length > 0 ? (
            currentSessions.map((session, index) => (
              <div 
                key={index} 
                className='w-full h-[19%] flex justify-between border-t'
              >
                <div className='h-[100%] w-[22.5%] flex items-center'>
                  <span className="md:hidden font-semibold mr-2">Date: </span>{session.date}
                </div>
                <div className='h-[100%] w-[22.5%] flex items-center'>
                  <span className="md:hidden font-semibold mr-2">Time: </span>{session.starttime} - {session.endtime}
                </div>
                <div className='h-[100%] w-[20%] flex items-center'>
                  <span className="md:hidden font-semibold mr-2">Subject: </span>{session.subject}
                </div>
                <div className='h-[100%] w-[25%] flex items-center'>
                  <span className="md:hidden font-semibold mr-2">Tutee: </span>{session.tuteefirstname} {session.tuteelastname}
                </div>
                <div className='h-[100%] w-[15%] flex items-center'>
                  <span className="md:hidden font-semibold mr-2">Earning: </span>Rp {session.price.toLocaleString()}
                </div>
              </div>
            ))
          ) : (
            <div>
              No session history found.
            </div>
          )}
        </div>
        
        {/* Pagination Controls */}
        {sessionsData.length > 0 && totalPages > 1 && ( 
           <div className='h-[10%] flex justify-between items-center'>
            <div>
                <TextSm className="text-gray-600">
                Showing {Math.min(indexOfLastItem, sessionsData.length)} of {sessionsData.length} sessions
                </TextSm>
            </div>
            {/* Container for Previous and Next buttons */}
            <div className='w-[25%] h-[100%] flex justify-between items-center'>
              <button 
                onClick={handlePreviousPage} 
                disabled={currentPage === 1}
                className={`w-[45%] h-[100%] text-sm rounded-lg border border-gray-300 flex items-center justify-center transition-colors duration-150 ease-in-out disabled:opacity-60 disabled:cursor-not-allowed ${
                  currentPage === 1 
                  ? 'bg-white text-gray-400' 
                  : 'bg-[#1F65A6] text-white hover:bg-[#185288]'
                }`}
              >
                Previous
              </button>
              <button 
                onClick={handleNextPage} 
                disabled={currentPage === totalPages}
                className={`w-[45%] h-[100%] text-sm rounded-lg border border-gray-300 flex items-center justify-center transition-colors duration-150 ease-in-out disabled:opacity-60 disabled:cursor-not-allowed ${
                  currentPage === totalPages 
                  ? 'bg-white text-gray-400' 
                  : 'bg-[#1F65A6] text-white hover:bg-[#185288]'
                }`}
              >
                Next
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default SessionsSection;