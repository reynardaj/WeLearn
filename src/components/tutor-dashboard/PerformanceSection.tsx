import React, { useState }  from 'react';
import {TextLg} from '../Text';
import DailyPerformance from './DailyPerfomance';
import WeeklyPerformance from './WeeklyPerformance';
import MonthlyPerformance from './MonthlyPerformance';
import YearlyPerformance from './YearlyPerformance';

interface PerformanceSectionProps {
  tutorId: string;
}
type PerformancePeriod = 'Daily' | 'Weekly' | 'Monthly' | 'Yearly';
 
const PerformanceSection: React.FC<PerformanceSectionProps> = ({ tutorId }) => {
  const [activePeriod, setActivePeriod] = useState<PerformancePeriod>('Daily');
  const [startDate, setStartDate] = useState<string>('');
  const [endDate, setEndDate] = useState<string>('');

  const renderPerformanceContent = () => {
    switch (activePeriod) {
      case 'Daily':
        return <DailyPerformance tutorId={tutorId} startDate={startDate} endDate={endDate} />;
      case 'Weekly':
        return <WeeklyPerformance tutorId={tutorId} startDate={startDate} endDate={endDate}/>;
      case 'Monthly':
        return <MonthlyPerformance tutorId={tutorId} startDate={startDate} endDate={endDate}/>;
      case 'Yearly':
        return <YearlyPerformance tutorId={tutorId} startDate={startDate} endDate={endDate}/>;
      default:
        // Should not happen, but good to have a fallback
        console.warn(`Unknown period: ${activePeriod}, defaulting to Daily.`);
        return <DailyPerformance tutorId={tutorId} startDate={startDate} endDate={endDate}/>;
    }
  };

  const getPeriodButtonClasses = (period: PerformancePeriod): string => {
    const baseClasses = "w-[30%] h-[80%] flex justify-center items-center rounded-2xl shadow-lg border-2 py-2 cursor-pointer transition-colors text-sm sm:text-base";
    if (activePeriod === period) {
      return `${baseClasses} bg-[#1F65A6] text-white hover:bg-[#1F65A6]`;
    }
    return `${baseClasses} bg-white border-[#E5E5E5] text-gray-700`;
  };

  return (
    <div className="w-full h-[100%] overflow-y-auto no-scrollbar">
      <div className="h-auto flex items-center">
        <TextLg>Performance Review</TextLg>
      </div>
      <div className="h-auto mt-3 mb-6 flex flex-row justify-between items-center ">
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
              onKeyPress={(e) => e.key === 'Enter' && setActivePeriod(period)}
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
              className="p-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 w-full text-sm"
            />
          </div>
          <div className="">to</div>
          <div className="flex items-center w-[40%]">
            <input
              type="date"
              id="endDate"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              className="p-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 w-full text-sm"
            />
          </div>
        </div>
      </div>
      <div className="h-[75%] w-full text-black">
        {renderPerformanceContent()}
      </div>
    </div>
  );
};

export default PerformanceSection; // Exporting App for demonstration, you'd export PerformanceSection