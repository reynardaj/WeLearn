'use client';
import * as React from 'react';
import { useEffect, useState } from 'react';
// import { useSearchParams } from 'next/navigation';
import { playfair } from '@/lib/fonts';
import WeekDatePicker from '@/components/DatePicker';
import Picker from '@/components/ButtonPicker';

const groupTimes = (times: string[]) => {
  const morning: string[] = [];
  const afternoon: string[] = [];
  const evening: string[] = [];

  times.forEach(time => {
    const hour = parseInt(time.split(':')[0]);
    if (hour >= 7 && hour < 12) {
      morning.push(time);
    } else if (hour >= 12 && hour < 17) {
      afternoon.push(time);
    } else if (hour >= 17 && hour <= 21) {
      evening.push(time);
    }
  });

  return { morning, afternoon, evening };
};

export default function BookingPage() {
  // const searchParams = useSearchParams();
  // const tutorID = searchParams.get('tutorID');
  const tutorID = 'TUT001';

  const [selectedDate, setSelectedDate] = useState(new Date());
  const [availableTimes, setAvailableTimes] = useState<string[]>([]);
  const [selectedSubject, setSelectedSubject] = useState<string | null>(null);
  const [selectedTime, setSelectedTime] = useState<string | null>(null);
  const [tutorSubjects, setTutorSubjects] = useState<string[]>([]);

  useEffect(() => {
    if (!tutorID || !selectedDate) return;

    const fetchData = async () => {
      const dateStr = selectedDate.toISOString().split('T')[0];
      const res = await fetch(`/api/booking?tutorID=${tutorID}&date=${dateStr}`);
      const data = await res.json();
      setAvailableTimes(data.timeSlots || []);
      setTutorSubjects(data.subjects || []);
    };

    fetchData();
  }, [tutorID, selectedDate]);

  const { morning, afternoon, evening } = groupTimes(availableTimes);

  return (
    <div className='min-h-screen w-full flex flex-col items-center justify-center' style={{ backgroundColor: 'rgba(0, 0, 0, 0.6)' }}>
      <div className='flex flex-col mt-10 mb-10 h-auto w-[90%] sm:w-[50%] md:w-[50%] lg:w-[40%] xl:w-[30%] rounded-2xl bg-[#F0FAF9] justify-start p-6 sm:p-8 md:p-10 lg:p-12 gap-5 overflow-visible'>

        <h1 className={`${playfair.className} text-[24px] text-center`}>Book A Session</h1>

        <WeekDatePicker
          selectedDate={selectedDate}
          setSelectedDate={setSelectedDate}
        />

        {/* Subject Section */}
        {tutorSubjects.length > 0 && (
          <div>
            <p className="text-[12px] mb-1">Subject</p>
            <Picker
              options={tutorSubjects}
              selected={selectedSubject}
              onSelect={setSelectedSubject}
            />
          </div>
        )}

        {/* Morning Section */}
        <div>
          <p className="text-[12px] mb-1">Morning</p>
          {morning.length > 0 ? (
            <Picker options={morning} selected={selectedTime} onSelect={setSelectedTime} />
          ) : (
            <p className="text-[11px] italic">No available time slots</p>
          )}
        </div>

        {/* Afternoon Section */}
        <div>
          <p className="text-[12px] mb-1">Afternoon</p>
          {afternoon.length > 0 ? (
            <Picker options={afternoon} selected={selectedTime} onSelect={setSelectedTime} />
          ) : (
            <p className="text-[11px] italic">No available time slots</p>
          )}
        </div>

        {/* Evening Section */}
        <div>
          <p className="text-[12px] mb-1">Evening</p>
          {evening.length > 0 ? (
            <Picker options={evening} selected={selectedTime} onSelect={setSelectedTime} />
          ) : (
            <p className="text-[11px] italic">No available time slots</p>
          )}
        </div>

      </div>
    </div>
  );
}
