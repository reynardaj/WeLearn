"use client";
import { playfair } from '@/lib/fonts';
import Button from '@mui/material/Button';
import { useEffect, useState } from 'react';
import { Heading1, Heading2, Heading3, Heading4 } from '@/components/Heading';
import { TextSm } from '@/components/Text';

type Session = {
  id: string;
  date: string;
  time: string;
  subject: string;
};

export default function UpcomingSession({ onCloseAction }: { onCloseAction: () => void }) {
  const [sessions, setSessions] = useState<Session[]>([]);

  useEffect(() => {
  fetch('/api/upcoming?tuteeID=b52d9970-d390-42f3-b01e-0a79e8ceb9f1')
    .then(res => {
      console.log("✅ API status:", res.status);
      return res.json();  // may throw
    })
    .then(data => {
      console.log("✅ Raw data from API:", data);
      setSessions(data.sessions || []);
    })
    .catch(err => {
      console.error("❌ Fetch or JSON parse error:", err);
    });
}, []);

  const grouped = sessions.reduce((acc, session) => {
    acc[session.date] = acc[session.date] || [];
    acc[session.date].push(session);
    return acc;
  }, {} as Record<string, Session[]>);

  return (
    <div className="absolute right-0 mt-2 w-[90vw] sm:w-[400px] bg-white rounded-2xl shadow-lg p-5 z-50 border border-gray-200">
      <div className="relative flex flex-col gap-2">
        <button onClick={onCloseAction} className="absolute top-1 right-2 text-xl font-bold cursor-pointer">
          &times;
        </button>
        <Heading4>Upcoming</Heading4>

        {Object.keys(grouped).length === 0 ? (
          <TextSm>No upcoming sessions.</TextSm>
        ) : (
          Object.entries(grouped).map(([date, items]) => (
            <div key={date} className="mb-4">
              <TextSm>{date}</TextSm>
              <hr className="mb-2 border-gray-300" />
              {items.map((s, i) => (
                <div key={i} className="flex items-start justify-between mb-3 text-sm gap-4">
                  <div className="w-[80px] text-left whitespace-nowrap">
                    <TextSm>{s.time}</TextSm>
                  </div>
                  <div className="flex-1 text-[#5C5C5C] text-center break-words">
                    <TextSm>{s.subject}</TextSm>
                  </div>
                  <div>
                    <Button 
                      variant="outlined"
                      sx={{
                        fontSize: "12px",
                        color: "black",
                        borderRadius: "8px",
                        border: '1px solid #d7d7d9',
                        padding: '3px',
                      }}
                    >
                      Join
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          ))
        )}
      </div>
    </div>
  );
}
