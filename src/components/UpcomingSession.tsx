'use client';
import { playfair } from '@/lib/fonts';
import Button from '@mui/material/Button';
import { useEffect, useState } from 'react';

type Session = {
  id: string;
  date: string;   // already formatted
  time: string;   // already formatted
  subject: string;
};

export default function UpcomingSession({ onClose }: { onClose: () => void }) {
  const [sessions, setSessions] = useState<Session[]>([]);

  useEffect(() => {
    fetch('/api/upcoming?tuteeID=b52d9970-d390-42f3-b01e-0a79e8ceb9f1')
      .then(res => res.json())
      .then(data => {
        console.log('Upcoming sessions:', data);
        setSessions(data.sessions || []);
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
        <button onClick={onClose} className="absolute top-1 right-2 text-xl font-bold cursor-pointer">
          &times;
        </button>
        <h2 className={`${playfair.className} text-[18px] md:text-[20px] font-extrabold`}>Upcoming</h2>

        {Object.keys(grouped).length === 0 ? (
          <p className="text-sm text-gray-500">No upcoming sessions.</p>
        ) : (
          Object.entries(grouped).map(([date, items]) => (
            <div key={date} className="mb-4">
              <p className="text-sm text-[#5C5C5C] mb-2">{date}</p>
              <hr className="mb-2 border-gray-300" />
              {items.map((s, i) => (
                <div key={i} className="flex items-start justify-between mb-3 text-sm gap-4">
                  <div className="w-[80px] text-left whitespace-nowrap">
                    <p className="font-medium">{s.time}</p>
                  </div>
                  <div className="flex-1 text-[#5C5C5C] text-center break-words">
                    <p>{s.subject}</p>
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
