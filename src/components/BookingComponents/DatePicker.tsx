'use client';
import { useState } from 'react';
import { IoIosArrowBack, IoIosArrowForward } from 'react-icons/io';
import { playfair } from '@/lib/fonts';
import { TextMd, TextSm } from '../Text';
import { Heading3 } from '../Heading';

interface WeekDatePickerProps {
  selectedDate: Date;
  setSelectedDate: (date: Date) => void;
}

export default function WeekDatePicker({ selectedDate, setSelectedDate }: WeekDatePickerProps) {
  const [startDate, setStartDate] = useState(() => {
    const today = new Date();
    const day = today.getDay();
    const diffToMonday = day === 0 ? -6 : 1 - day;
    const monday = new Date(today);
    monday.setDate(today.getDate() + diffToMonday);
    return monday;
  });

  const getWeekDates = () => {
    const week = [];
    for (let i = 0; i < 7; i++) {
      const date = new Date(startDate);
      date.setDate(startDate.getDate() + i);
      week.push(date);
    }
    return week;
  };

  const prevWeek = () => {
    const newStart = new Date(startDate);
    newStart.setDate(startDate.getDate() - 7);
    setStartDate(newStart);
    setSelectedDate(newStart); // make sure user sees updated day
  };

  const nextWeek = () => {
    const newStart = new Date(startDate);
    newStart.setDate(startDate.getDate() + 7);
    setStartDate(newStart);
    setSelectedDate(newStart); // make sure user sees updated day
  };

  const formatWeekRange = (start: Date) => {
    const end = new Date(start);
    end.setDate(start.getDate() + 6);
    const startDay = start.getDate();
    const endDay = end.getDate();
    const startMonth = start.toLocaleString('default', { month: 'short' });
    const endMonth = end.toLocaleString('default', { month: 'short' });
    const year = start.getFullYear();
    return startMonth === endMonth
      ? `${startDay}–${endDay} ${startMonth} ${year}`
      : `${startDay} ${startMonth} – ${endDay} ${endMonth} ${year}`;
  };

  const formatDay = (date: Date) => date.getDate();

  return (
    <div className="flex flex-col items-center bg-[#F0FAF9] rounded-lg w-full max-w-md mx-auto">
      <div className="flex items-center justify-between w-full">
        <button onClick={prevWeek}><IoIosArrowBack size={24} /></button>
        <TextMd>{formatWeekRange(startDate)}</TextMd>
        <button onClick={nextWeek}><IoIosArrowForward size={24} /></button>
      </div>

      <div className="grid grid-cols-7 gap-2 w-full text-center text-[10px] mt-3">
        {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map((day, index) => (
          <div key={index}><TextSm>{day}</TextSm></div>
        ))}
      </div>

      <div className="grid grid-cols-7 gap-2 w-full text-center">
        {getWeekDates().map((date, index) => (
          <div
            key={index}
            onClick={() => setSelectedDate(date)}
            className={`flex flex-col items-center justify-center p-1 rounded-lg cursor-pointer
              ${date.toDateString() === selectedDate.toDateString() ? 'border-2 border-[#1F65A6]' : ''}`}
          >
            <Heading3>{formatDay(date)}</Heading3>
            <TextSm>{date.toLocaleString('default', { month: 'short' })}</TextSm>
          </div>
        ))}
      </div>

      <div className="w-full h-[1px] bg-gray-300 mt-2" />
    </div>
  );
}
