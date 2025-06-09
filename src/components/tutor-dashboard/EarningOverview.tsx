// components/tutor-dashboard-performance/EarningOverview.tsx
"use client";
import React, { useState }  from 'react';
import DailyEarning from './DailyEarning';
import WeeklyEarning from './WeeklyEarning';
import MonthlyEarning from './MonthlyEarning';
import YearlyEarning from './YearlyEarning';

interface EarningProps {
  tutorId: string;
}
type PerformancePeriod = 'Daily' | 'Weekly' | 'Monthly' | 'Yearly';
 
const EarningOverview: React.FC<EarningProps> = ({ tutorId }) => {
  const [activePeriod, setActivePeriod] = useState<PerformancePeriod>('Daily');
  const [startDate, setStartDate] = useState<string>('');
  const [endDate, setEndDate] = useState<string>('');

  const renderEarningContent = () => {
    switch (activePeriod) {
      case 'Daily':
        return <DailyEarning tutorId={tutorId} startDate={startDate} endDate={endDate} />;
      case 'Weekly':
        return <WeeklyEarning tutorId={tutorId} startDate={startDate} endDate={endDate} />;
      case 'Monthly':
        return <MonthlyEarning tutorId={tutorId} startDate={startDate} endDate={endDate} />;
      case 'Yearly':
        return <YearlyEarning tutorId={tutorId} startDate={startDate} endDate={endDate} />;
      default:
        console.warn(`Unknown period: ${activePeriod}, defaulting to Daily.`);
        return <DailyEarning tutorId={tutorId} startDate={startDate} endDate={endDate} />;
    }
  };

  const getPeriodButtonClasses = (period: PerformancePeriod): string => {
    const baseClasses = "w-[30%] h-[80%] flex justify-center items-center rounded-2xl shadow-lg border-2 py-2 cursor-pointer transition-colors text-sm sm:text-base";
    if (activePeriod === period) {
      return `${baseClasses} bg-[#1F65A6] text-white`;
    }
    return `${baseClasses} bg-white text-gray-700`;
  };

  return (
    <div className="w-full h-[100%]">
      <div className="h-auto mb-6 flex flex-row justify-between items-center ">
        <div className="w-[45%] flex justify-between items-center space-x-2">
          {(['Daily', 'Weekly', 'Monthly', 'Yearly'] as PerformancePeriod[]).map((period) => (
            <div
              key={period}
              className={getPeriodButtonClasses(period)}
              onClick={() => {
                setActivePeriod(period);
                setStartDate('');
                setEndDate('');
              }}
              role="button"
              tabIndex={0}
              onKeyPress={(e) => { if(e.key === 'Enter') {
                setActivePeriod(period);
                setStartDate('');
                setEndDate('');
              }}}
            >
              {period}
            </div>
          ))}
        </div>
        <div className="w-[45%] flex items-center justify-around text-base text-gray-600">
          <div className="flex items-center w-[40%]">
            <input
              type="date"
              id="startDate"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              className="p-2 border border-gray-300 rounded-md shadow-sm w-[100%]"
            />
          </div>
          <div className="">to</div>
          <div className="flex items-center w-[40%]">
            <input
              type="date"
              id="endDate"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              className="p-2 border border-gray-300 rounded-md shadow-sm w-[100%]"
            />
          </div>
        </div>
      </div>
      <div className="h-[88%] w-full text-black">
        {renderEarningContent()}
      </div>
    </div>
  );
};

export default EarningOverview;
