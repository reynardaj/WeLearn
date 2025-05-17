// components/SessionsSection.tsx
import React from 'react';
import Heading3 from './AnalyticHeading'; // Adjust path as needed

const SessionsSection: React.FC = () => {
  return (
    <div className="w-full mt-4">
      {/* session part */}
      <div className="h-auto md:h-[10%] flex flex-col md:flex-row justify-between items-center mt-3 gap-2 md:gap-0">
        <div className="w-full md:w-[50%] h-full flex items-center">
          <Heading3>Session History</Heading3>
        </div>
        <div className="w-full md:w-[30%] h-full flex justify-between items-center text-sm md:text-base">
          <div>pick a date</div>
          <div>to</div>
          <div>pick a date</div>
        </div>
      </div>
      <div className="h-[300px] md:h-[75%] w-full bg-sky-600 mt-3 rounded-lg flex justify-center items-center text-white text-2xl">
        {/* Changed bg color for distinction */}
        Session Statistics
      </div>
    </div>
  );
};

export default SessionsSection;