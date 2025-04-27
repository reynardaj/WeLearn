'use client';
import * as React from 'react';
import { useState } from 'react';
import { playfair } from '@/lib/fonts';
import WeekDatePicker from '@/components/DatePicker';
import Picker from '@/components/ButtonPicker';
import tutors from '@/data/tutorsBooking.json';
import availability from '@/data/availabilityBooking.json';

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

export default function page() {
  // selected tutor
  const selectedTutorId = "tutor-001";

  // Find tutor info
  const tutor = tutors.find(tutor => tutor.id === selectedTutorId);

  // Find availability for this tutor
  const tutorAvailability = availability.filter(slot => slot.tutor_id === selectedTutorId);

  // Find available times (only not booked)
  const availableTimes = tutorAvailability
    .filter(slot => !slot.is_booked)
    .map(slot => slot.time);

  const { morning, afternoon, evening } = groupTimes(availableTimes);

  const [selectedSubject, setSelectedSubject] = useState<string | null>(null);
  const [selectedTime, setSelectedTime] = useState<string | null>(null);

  return (
    <div className='min-h-screen w-full flex flex-col items-center justify-center' style={{ backgroundColor: 'rgba(0, 0, 0, 0.6)' }}>
      <div className='flex flex-col mt-10 mb-10 h-auto w-[90%] sm:w-[50%] md:w-[50%] lg:w-[40%] xl:w-[30%] rounded-2xl bg-[#F0FAF9] justify-start p-6 sm:p-8 md:p-10 lg:p-12 gap-5 overflow-visible'>
        
        <h1 className={`${playfair.className} text-[24px] text-center`}>Book A Session</h1>

        <WeekDatePicker />

        {/* Subject Section */}
        <div>
          <p className="text-[12px] mb-1">Subject</p>
          <Picker
            options={tutor?.subjects || []}
            selected={selectedSubject}
            onSelect={setSelectedSubject}
          />
        </div>

        {/* Morning Section */}
        {morning.length > 0 && (
          <div>
            <p className="text-[12px] mb-1">Morning</p>
            <Picker
              options={morning}
              selected={selectedTime}
              onSelect={setSelectedTime}
            />
          </div>
        )}

        {/* Afternoon Section */}
        {afternoon.length > 0 && (
          <div>
            <p className="text-[12px] mb-1">Afternoon</p>
            <Picker
              options={afternoon}
              selected={selectedTime}
              onSelect={setSelectedTime}
            />
          </div>
        )}

        {/* Evening Section */}
        {evening.length > 0 && (
          <div>
            <p className="text-[12px] mb-1">Evening</p>
            <Picker
              options={evening}
              selected={selectedTime}
              onSelect={setSelectedTime}
            />
          </div>
        )}

      </div>
    </div>
  );
}
