'use client';
import { useState } from 'react';
import { IoIosArrowBack, IoIosArrowForward } from 'react-icons/io';
import { playfair } from '@/lib/fonts';

const daysOfWeek = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

export default function WeekDatePicker() {
    const [startDate, setStartDate] = useState(() => {
        const today = new Date();
        const day = today.getDay(); // Sunday=0, Monday=1, ..., Saturday=6
      
        // Adjust so that week starts on Monday
        const diffToMonday = day === 0 ? -6 : 1 - day; 
        const monday = new Date(today);
        monday.setDate(today.getDate() + diffToMonday);
      
        return monday;
    });
      
    const [selectedDate, setSelectedDate] = useState(new Date());

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
    setSelectedDate(newStart); // Optional: reset selected date
  };

  const nextWeek = () => {
    const newStart = new Date(startDate);
    newStart.setDate(startDate.getDate() + 7);
    setStartDate(newStart);
    setSelectedDate(newStart); // Optional: reset selected date
  };

  const formatWeekRange = (start: Date) => {
    const end = new Date(start);
    end.setDate(start.getDate() + 6);
  
    const startDay = start.getDate();
    const endDay = end.getDate();
    const startMonth = start.toLocaleString('default', { month: 'short' });
    const endMonth = end.toLocaleString('default', { month: 'short' });
    const startYear = start.getFullYear();
    const endYear = end.getFullYear();
  
    if (startMonth === endMonth && startYear === endYear) {
      // Same month and same year
      return `${startDay}–${endDay} ${startMonth} ${startYear}`;
    } else if (startYear === endYear) {
      // Different month but same year
      return `${startDay} ${startMonth} – ${endDay} ${endMonth} ${startYear}`;
    } else {
      // Different year too (very rare, but safe)
      return `${startDay} ${startMonth} ${startYear} – ${endDay} ${endMonth} ${endYear}`;
    }
  };  

  const formatDay = (date: Date) => {
    return date.getDate();
  };

  return (
    <div className="flex flex-col items-center bg-[#F0FAF9] rounded-lg w-full max-w-md mx-auto">
      {/* Month and year header */}
      <div className="flex items-center justify-between w-full">
        <button onClick={prevWeek}><IoIosArrowBack size={24} /></button>
        <h2 className="text-[13px] font-normal">{formatWeekRange(startDate)}</h2>
        <button onClick={nextWeek}><IoIosArrowForward size={24} /></button>
      </div>

      {/* Weekdays */}
      <div className="grid grid-cols-7 gap-2 w-full text-center text-[10px] mt-3">
        {daysOfWeek.map((day, index) => (
          <div key={index}>{day}</div>
        ))}
      </div>

      {/* Dates */}
      <div className="grid grid-cols-7 gap-2 w-full text-center">
        {getWeekDates().map((date, index) => (
          <div
            key={index}
            onClick={() => setSelectedDate(date)}
            className={`flex flex-col items-center justify-center p-1 rounded-lg cursor-pointer
              ${date.toDateString() === selectedDate.toDateString() ? 'border-2 border-[#1F65A6]' : ''}
            `}
          >
            <span className={`${playfair.className} text-[20px] font-semibold`}>{formatDay(date)}</span>
            <span className="text-[10px]">{date.toLocaleString('default', { month: 'short' })}</span>
          </div>
        ))}
      </div>

      {/* Line below */}
      <div className="w-full h-[1px] bg-gray-300 mt-2" />
    </div>
  );
}
