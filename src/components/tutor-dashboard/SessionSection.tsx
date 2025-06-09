// components/SessionsSection.tsx
"use client";

import React, { useState, useEffect } from 'react';
import { TextLg, TextMd, TextSm } from "@/components/Text";

interface Session {
  date: string;
  starttime: string;
  endtime: string;
  subject: string;
  tuteefirstname: string;
  tuteelastname: string;
  price: number;
}

interface SessionsSectionProps {
  tutorId: string;
}

const SessionsSection: React.FC<SessionsSectionProps> = ({ tutorId }) => {
  const [sessionsData, setSessionsData] = useState<Session[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');

  useEffect(() => {
    // Client-side validation to provide instant feedback
    if (startDate && endDate && new Date(endDate) < new Date(startDate)) {
      setError("End date cannot be before start date.");
      setSessionsData([]); // Clear data on input error
      setIsLoading(false); // Stop loading indicator
      return; // Stop the fetch from running
    }

    const fetchSessionHistory = async () => {
      if (!tutorId) {
        setError("Tutor ID is not available.");
        setIsLoading(false);
        return;
      }

      setIsLoading(true);
      setError(null); // Clear previous errors before a new fetch
      
      let apiUrl = `/api/tutor-dashboard/session?tutorId=${tutorId}`;
      if (startDate) {
        apiUrl += `&startDate=${startDate}`;
      }
      if (endDate) {
        apiUrl += `&endDate=${endDate}`;
      }

      try {
        const response = await fetch(apiUrl);
        const data = await response.json();
        if (!response.ok) {
          // Use the error message from the API if available
          throw new Error(data.message || `Failed to fetch session history: ${response.statusText}`);
        }
        setSessionsData(data);
        setCurrentPage(1);
      } catch (err) {
        console.error("Fetch session history error:", err);
        setError(err instanceof Error ? err.message : "An unknown error occurred while fetching session history.");
        setSessionsData([]); // Clear data on fetch error
      } finally {
        setIsLoading(false);
      }
    };

    fetchSessionHistory();
  }, [tutorId, startDate, endDate]);

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentSessions = sessionsData.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(sessionsData.length / itemsPerPage);

  const handleNextPage = () => {
    if (currentPage < totalPages) setCurrentPage(currentPage + 1);
  };

  const handlePreviousPage = () => {
    if (currentPage > 1) setCurrentPage(currentPage - 1);
  };

  return (
    <div className="w-full h-[100%] mt-2">
      {/* --- CONTROLS SECTION --- */}
      <div className="h-[10%] flex justify-between items-center">
        <div className="flex items-center ">
          <TextLg>Session History</TextLg>
        </div>
        <div className="w-[45%] flex items-center justify-around text-base text-gray-600">
          <div className="flex items-center w-[40%]">
            <input 
              type="date" 
              id="startDate" 
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              className="p-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 w-[100%]"/>
          </div>
          <div>to</div>
          <div className="flex items-center w-[40%]">
            <input 
              type="date" 
              id="endDate" 
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              className="p-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 w-[100%]"/>
          </div>
        </div>
      </div>

      {/* --- ERROR DISPLAY --- */}
      {/* This block will now display the error message above the table area */}
      {error && (
        <div className="w-full h-[80%] flex justify-center items-center">
            <TextMd>{error}</TextMd>
        </div>
      )}

      {/* --- TABLE & PAGINATION CONTAINER --- */}
      {/* **THE FIX**: This entire block is now conditionally rendered. It will not show if there is an error. */}
      {!error && (
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
          <div className='h-[70%]'>
            {isLoading ? (
               <div className="w-full pt-10 text-center text-gray-500">Loading...</div>
            ) : currentSessions.length > 0 ? (
              currentSessions.map((session, index) => (
                <div 
                  key={index} 
                  className='w-full h-[19%] flex justify-between border-t'
                >
                  <div className='h-[100%] w-[22.5%] flex items-center'>{session.date}</div>
                  <div className='h-[100%] w-[22.5%] flex items-center'>{session.starttime} - {session.endtime}</div>
                  <div className='h-[100%] w-[20%] flex items-center'>{session.subject}</div>
                  <div className='h-[100%] w-[25%] flex items-center'>{session.tuteefirstname} {session.tuteelastname}</div>
                  <div className='h-[100%] w-[15%] flex items-center'>Rp {session.price.toLocaleString()}</div>
                </div>
              ))
            ) : (
              <div className="w-full pt-10 text-center text-gray-500">
                No session history found for this period.
              </div>
            )}
          </div>
          
          {/* Pagination Controls */}
          {sessionsData.length > 0 && totalPages > 1 && ( 
            <div className='h-[10%] flex justify-between items-center'>
              <div>
                <TextSm className="text-gray-600">
                  Showing {indexOfFirstItem + 1} to {Math.min(indexOfLastItem, sessionsData.length)} of {sessionsData.length} sessions
                </TextSm>
              </div>
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
      )}
    </div>
  );
};

export default SessionsSection;