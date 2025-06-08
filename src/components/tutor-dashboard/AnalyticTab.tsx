// components/AnalyticsTabs.tsx
"use client";
import React, { useState } from 'react';
import PerformanceSection from './PerformanceSection';
import SessionsSection from './SessionSection';
import FeedbackSection from './FeedbackSession';

export type TabName = 'performance' | 'sessions' | 'feedback';

interface AnalyticsTabsProps {
  tutorId: string;
}

const AnalyticsTabs: React.FC<AnalyticsTabsProps> = ({ tutorId }) => {
  const [activeTab, setActiveTab] = useState<TabName>('performance');

  const renderContent = () => {
    switch (activeTab) {
      case 'performance':
        return <PerformanceSection tutorId={tutorId}/>;
      case 'sessions':
        return <SessionsSection tutorId={tutorId}/>;
      case 'feedback':
        return <FeedbackSection tutorId={tutorId}/>;
      default:
        return <PerformanceSection tutorId={tutorId}/>; // Default to performance
    }
  };

  const getTabClasses = (tabName: TabName): string => {
    const baseClasses = "w-[32%] h-[80%] flex justify-center items-center rounded-lg cursor-pointer transition-colors duration-150 ease-in-out text-xs sm:text-sm";
    if (activeTab === tabName) {
      return `${baseClasses} bg-white text-black shadow-md`; // Active tab style
    }
    return `${baseClasses}  text-black`; // Inactive tab style
  };

  return (
    <div className='h-[100%]'> 
      <div className="flex w-[50%] h-[8%] justify-evenly items-center rounded-lg bg-[#E5E5E5] mt-2">
        <div
          className={getTabClasses('performance')}
          onClick={() => setActiveTab('performance')}
          role="button"
          tabIndex={0}
          onKeyPress={(e) => e.key === 'Enter' && setActiveTab('performance')}
        >
          Performance
        </div>
        <div
          className={getTabClasses('sessions')}
          onClick={() => setActiveTab('sessions')}
          role="button"
          tabIndex={0}
          onKeyPress={(e) => e.key === 'Enter' && setActiveTab('sessions')}
        >
          Sessions
        </div>
        <div
          className={getTabClasses('feedback')}
          onClick={() => setActiveTab('feedback')}
          role="button"
          tabIndex={0}
          onKeyPress={(e) => e.key === 'Enter' && setActiveTab('feedback')}
        >
          Feedback
        </div>
      </div>

      <div className="w-full mt-2 h-[87%]">
        {renderContent()}
      </div>
    </div>
  );
};

export default AnalyticsTabs;