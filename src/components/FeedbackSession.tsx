import React from 'react';
import Heading3 from './AnalyticHeading';

interface RatingDistribution {
  stars: number;
  count: number;
  percentage: string; // e.g., "80%"
}

const FeedbackSection: React.FC = () => {
  const averageRating = 4.2;
  const totalReviews = 250;
  const ratingDistribution: RatingDistribution[] = [
    { stars: 5, count: 150, percentage: '60%' },
    { stars: 4, count: 70, percentage: '28%' },
    { stars: 3, count: 20, percentage: '8%' },
    { stars: 2, count: 7, percentage: '3%' },
    { stars: 1, count: 3, percentage: '1%' },
  ];

  return (
    <div className="w-full mt-4">
      {/* rating part */}
      <div className="h-auto md:h-[10%] flex items-center mt-3">
        <div className="w-full md:w-[50%] h-full flex items-center">
          <Heading3>Rating Overview</Heading3>
        </div>
      </div>

      <div className="h-auto w-full mt-3 p-4 bg-white shadow-lg rounded-lg">
        <div className="h-auto mb-6 flex flex-col sm:flex-row items-center sm:items-end space-y-2 sm:space-y-0 sm:space-x-3">
          <div className="text-5xl font-bold text-gray-700">{averageRating.toFixed(1)}<span className="text-3xl text-gray-500">/5</span></div>
          <div className="text-yellow-400 text-3xl">
            {'★'.repeat(Math.floor(averageRating))}
            {averageRating % 1 >= 0.5 ? '★' : ''} {/* Basic half star logic, consider an icon */}
            {'☆'.repeat(5 - Math.ceil(averageRating))}
          </div>
          <div className="text-gray-600">({totalReviews} total reviews)</div>
        </div>

        <div className="h-auto w-full flex flex-col justify-between space-y-2 mb-6">
          {ratingDistribution.map(({ stars, count, percentage }) => (
            <div key={stars} className="w-full h-auto flex items-center space-x-2">
              <span className="w-[5%] text-sm text-gray-600">{stars}</span>
              <div className="w-[85%] h-3 bg-gray-200 rounded-full">
                <div
                  className="h-3 bg-yellow-400 rounded-full"
                  style={{ width: percentage }}
                ></div>
              </div>
              <div className="w-[10%] text-xs text-gray-500 text-right">({count})</div>
            </div>
          ))}
        </div>

        <div className="h-auto w-full flex items-end mb-3">
          <Heading3 className="text-lg">Recent Feedback</Heading3>
        </div>
        <div className="h-[200px] w-full border border-gray-300 rounded-md p-3 overflow-y-auto space-y-2 bg-gray-50">
          {/* Placeholder for actual feedback items */}
          {[1, 2, 3].map(i => (
            <div key={i} className="p-2 border-b border-gray-200 last:border-b-0">
              <p className="font-semibold text-sm">User {String.fromCharCode(64 + i)}</p>
              <p className="text-xs text-gray-600">This is some sample feedback. It was a good session overall.</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default FeedbackSection;