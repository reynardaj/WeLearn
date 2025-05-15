// components/BookingModal.tsx
'use client';
import { useEffect, useState } from 'react';
import { playfair } from '@/lib/fonts';
import WeekDatePicker from '@/components/DatePicker';
import Picker from '@/components/ButtonPicker';
import Button from '@mui/material/Button';

const groupTimes = (times: string[]) => {
  const morning: string[] = [];
  const afternoon: string[] = [];
  const evening: string[] = [];

  times.forEach(time => {
    const hour = parseInt(time.split(':')[0]);
    if (hour >= 7 && hour < 12) morning.push(time);
    else if (hour >= 12 && hour < 17) afternoon.push(time);
    else if (hour >= 17 && hour <= 21) evening.push(time);
  });

  return { morning, afternoon, evening };
};

export default function BookingModal({ tutorID, onClose }: { tutorID: string; onClose: () => void }) {
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
    <div className="fixed inset-0 z-50 flex items-center justify-center" style={{ backgroundColor: 'rgba(0, 0, 0, 0.6)' }}>
      <div className="relative flex flex-col w-[90%] sm:w-[60%] md:w-[50%] lg:w-[40%] xl:w-[30%] max-h-[90vh] overflow-y-auto rounded-2xl bg-[#F0FAF9] p-6 gap-5">
        <button onClick={onClose} className="absolute top-2 right-3 text-[20px] font-bold cursor-pointer">&times;</button>

        <h1 className={`${playfair.className} text-[24px] text-center`}>Book A Session</h1>

        <WeekDatePicker selectedDate={selectedDate} setSelectedDate={setSelectedDate} />

        {tutorSubjects.length > 0 && (
          <div>
            <p className="text-[12px] mb-1">Subject</p>
            <Picker options={tutorSubjects} selected={selectedSubject} onSelect={setSelectedSubject} />
          </div>
        )}

        {['Morning', 'Afternoon', 'Evening'].map((label, i) => {
          const slot = [morning, afternoon, evening][i];
          return (
            <div key={label}>
              <p className="text-[12px] mb-1">{label}</p>
              {slot.length > 0 ? (
                <Picker options={slot} selected={selectedTime} onSelect={setSelectedTime} />
              ) : (
                <p className="text-[11px] italic">No available time slots</p>
              )}
            </div>
          );
        })}

        <Button variant="outlined" sx={{ fontSize: "12px", color: "white", borderRadius: "8px", backgroundColor: "#1F65A6", padding: '8px'}}>Continue</Button>
      </div>
    </div>
  );
}
