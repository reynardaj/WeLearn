// components/AnalyticsTabs.tsx
"use client";
import React, { useState } from 'react';
import PerformanceSection from './PerformanceSection';
import SessionsSection from './SessionSection';
import FeedbackSection from './FeedbackSession';

export type TabName = 'performance' | 'sessions' | 'feedback';

const AnalyticsTabs: React.FC = () => {
  const [activeTab, setActiveTab] = useState<TabName>('performance');

  const renderContent = () => {
    switch (activeTab) {
      case 'performance':
        return <PerformanceSection />;
      case 'sessions':
        return <SessionsSection />;
      case 'feedback':
        return <FeedbackSection />;
      default:
        return <PerformanceSection />; // Default to performance
    }
  };

  const getTabClasses = (tabName: TabName): string => {
    const baseClasses = "w-[30%] h-[80%] flex justify-center items-center rounded-lg cursor-pointer transition-colors duration-150 ease-in-out text-xs sm:text-sm";
    if (activeTab === tabName) {
      return `${baseClasses} bg-blue-600 text-white shadow-md`; // Active tab style
    }
    return `${baseClasses} bg-white hover:bg-gray-100 text-gray-700`; // Inactive tab style
  };

  return (
    <> 
      <div className="flex w-full h-full justify-between items-center rounded-lg bg-[#E5E5E5] p-1.5 sm:p-2">
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

      {/* Content Area - This will be rendered below the tab bar */}
      <div className="w-full mt-3"> {/* mt-3 to give some space below the tabs */}
        {renderContent()}
      </div>
    </>
  );
};

export default AnalyticsTabs;