import React from 'react';
import Heading3 from './AnalyticHeading'; // Adjust path as needed

const PerformanceSection: React.FC = () => {
  return (
    <div className="w-full mt-4"> {/* Added mt-4 for consistent spacing from tabs */}
      {/* performance part */}
      <div className="h-auto flex items-center">
        <Heading3>Performance review</Heading3>
      </div>
      <div className="h-auto md:h-[10%] flex flex-col md:flex-row justify-between items-center mt-3 gap-2 md:gap-0">
        <div className="w-full md:w-[50%] h-full flex justify-between items-center gap-2">
          {['Daily', 'Weekly', 'Monthly'].map((period) => (
            <div
              key={period}
              className="w-[30%] h-[80%] flex justify-center items-center rounded-2xl bg-white shadow-lg border-2 border-[#E5E5E5] py-2 cursor-pointer hover:bg-gray-100 transition-colors"
            >
              {period}
            </div>
          ))}
        </div>
        <div className="w-full md:w-[30%] h-full flex justify-between items-center text-sm md:text-base">
          <div>pick a date</div>
          <div>to</div>
          <div>pick a date</div>
        </div>
      </div>
      <div className="h-[300px] md:h-[65%] w-full bg-amber-600 mt-3 rounded-lg flex justify-center items-center text-white text-2xl">
        Performance Statistics
      </div>
    </div>
  );
};

export default PerformanceSection;