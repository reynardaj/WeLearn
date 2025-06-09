"use client";
import { playfair } from '@/lib/fonts';
import { Button } from "@/components/button";
import { useEffect, useState } from 'react';
import { Heading1, Heading2, Heading3, Heading4 } from '@/components/Heading';
import { TextMd, TextSm } from '@/components/Text';
import { useAuth } from '@clerk/nextjs';

type Session = {
  id: string;
  date: string;
  time: string;
  subject: string;
  joinUrl: string;
};

export default function UpcomingSession({ onCloseAction }: { onCloseAction: () => void }) {
  const { userId } = useAuth();
  const [sessions, setSessions] = useState<Session[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!userId) return;

    let cancelled = false;

    async function load() {
      setLoading(true);
      try {
        const tRes = await fetch(`/api/users/tutee/${userId}`);
        if (!tRes.ok) throw new Error("Couldn’t load tutee ID");
        const { tuteeId } = await tRes.json();

        const uRes = await fetch(`/api/upcoming?tuteeID=${tuteeId}`);
        if (!uRes.ok) throw new Error("Couldn’t load upcoming sessions");
        const { sessions } = await uRes.json();

        if (!cancelled) setSessions(sessions || []);
      } catch (err: any) {
        console.error(err);
        if (!cancelled) setError(err.message);
      }
      setLoading(false);
    }

    load();
    return () => {
      cancelled = true;
    };
  }, [userId]);



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
        {
          loading ? (
            <div>Loading...</div>
          ) : (
            <>
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
                          <button
                            type={"button"}
                            className={`w-auto h-5 px-4 py-3 rounded-[8px] border-1 inline-flex justify-center items-center gap-2.5 cursor-pointer`}
                            onClick={() => window.open(s.joinUrl, "_blank")}
                          >
                            <TextSm>Join</TextSm>
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                ))
              )}
            </>
          )
        }
      </div>
    </div>
  );
}
