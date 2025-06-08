// components/FeedbackSection.tsx
"use client";
import React, { useState, useEffect } from 'react';
import { TextLg, TextMd, TextSm } from '../Text'; // Adjust path as needed

interface RatingDistributionItem {
  stars: number;
  count: number;
  percentage: string;
}

interface RecentFeedbackItem {
  rating: number;
  comment: string;
  tuteeFirstName: string;
  tuteeLastName: string;
  tuteeProfileImg?: string; // Optional profile image
}

interface FeedbackData {
  averageRating: number;
  totalReviews: number;
  ratingDistribution: RatingDistributionItem[];
  recentFeedbacks: RecentFeedbackItem[];
}

interface FeedbackSectionProps {
  tutorId: string;
}

const FeedbackSection: React.FC<FeedbackSectionProps> = ({ tutorId }) => {
  const [feedbackData, setFeedbackData] = useState<FeedbackData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!tutorId) {
      setError("Tutor ID is not provided.");
      setIsLoading(false);
      return;
    }

    const fetchFeedbackDetails = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const response = await fetch(`/api/tutor-dashboard/feedback?tutorId=${tutorId}`);
        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.message || `Failed to fetch feedback details: ${response.statusText}`);
        }
        const data: FeedbackData = await response.json();
        setFeedbackData(data);
      } catch (err) {
        console.error("Fetch feedback details error:", err);
        setError(err instanceof Error ? err.message : "An unknown error occurred.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchFeedbackDetails();
  }, [tutorId]);

  if (isLoading) {
    return (
      <div className="w-full h-auto p-4 flex justify-center items-center">
        <TextLg>Loading feedback...</TextLg>
      </div>
    );
  }

  if (error) {
    return (
      <div className="w-full h-auto p-4 text-red-500">
        <TextLg>Error loading feedback:</TextLg>
        <TextMd>{error}</TextMd>
      </div>
    );
  }

  if (!feedbackData || feedbackData.totalReviews === 0) {
    return (
      <div className="w-full h-auto p-4 text-gray-500">
        <TextLg>Rating Overview</TextLg>
        <TextMd className="mt-2">No feedback available yet for this tutor.</TextMd>
      </div>
    );
  }

  const { averageRating, totalReviews, ratingDistribution, recentFeedbacks } = feedbackData;

  // Helper function to render stars
  const renderStars = (rating: number) => {
    const fullStars = Math.floor(rating);
    const halfStar = rating % 1 >= 0.5 ? 1 : 0;
    const emptyStars = 5 - fullStars - halfStar;
    return (
      <>
        {'★ '.repeat(fullStars)}
        {halfStar ? '★ ' : ''} {/* Using full star for half for simplicity, or use a half-star icon */}
        {'☆ '.repeat(emptyStars)}
      </>
    );
  };


  return (
    <div className="w-full h-[100%]"> {/* Added common styling */}
      {/* Rating Overview Title */}
      <div className="h-auto"> {/* Increased margin-bottom */}
        <TextLg className="font-semibold text-gray-700 ">Rating Overview</TextLg>
      </div>

      <div className="w-full h-auto flex mb-4 justify-between">
        {/* Average Rating Display */}
        <div className="w-[30%]">
          <div className='flex items-baseline'>
            <TextLg className="text-4xl font-bold">{averageRating.toFixed(1)}</TextLg>
            <TextLg className="text-xl">/5</TextLg>
          </div>
          <div className={`text-yellow-400 text-2xl my-1`}> {/* Increased star size */}
            {renderStars(averageRating)}
          </div>
          <div className="text-sm">{totalReviews} reviews</div>
        </div>

        {/* Rating Distribution Bars */}
        <div className="w-[60%]">
          {ratingDistribution.map(({ stars, count, percentage }) => (
            <div key={stars} className="w-full flex items-center justify-between mb-1.5">
              <span className="w-[7%] flex justify-center text-xs">{stars}★</span>
              <div className="w-[80%] bg-gray-200 rounded-full"> {/* Slightly thicker bar */}
                <div
                  className="h-2.5 bg-yellow-400 rounded-full"
                  style={{ width: percentage }}
                ></div>
              </div>
              <div className="w-[7%] flex justify-center items-center text-xs">({count})</div>
            </div>
          ))}
        </div>
      </div>


      {/* Recent Feedback Section */}
      <div className="h-auto mb-2">
        <TextLg className="font-semibold text-gray-700">Recent Feedback</TextLg>
      </div>
      <div className='h-[50%]'>
          {recentFeedbacks.length > 0 ? (
            recentFeedbacks.map((feedback, index) => (
              <div key={index} className="border-b border-gray-200 py-2">
                <div className="flex items-center">
                  <div className='flex-shrink-0 h-10 w-10 bg-gray-300 rounded-full flex items-center justify-center mr-3'>
                    {feedback.tuteeFirstName.charAt(0)}{feedback.tuteeLastName.charAt(0)}
                  </div>
                  <div className="flex items-center">
                    <TextMd className="font-semibold text-gray-800">
                      {feedback.tuteeFirstName} {feedback.tuteeLastName}
                    </TextMd>
                    <div className="text-yellow-400 text-sm">
                      {renderStars(feedback.rating)}
                    </div>
                  </div>
                </div>
                <TextSm className="text-gray-600 leading-relaxed">{feedback.comment}</TextSm>
              </div>
              
              // <div key={index} className='h-auto bg-gray-50 border-b border-gray-200 '>
              //   <div className='h-auto flex py-2'>
              //      <div className="flex items-center">
              //        <TextMd className="font-semibold mr-3">
              //          {feedback.tuteeFirstName} {feedback.tuteeLastName}
              //        </TextMd>
              //        <div className="text-yellow-400 text-sm">
              //          {renderStars(feedback.rating)}
              //        </div>
              //      </div>
              //   </div>
              //   <TextSm className="h-auto leading-relaxed">{feedback.comment}</TextSm>
              // </div>
            ))
          ) : (
            <TextMd className="text-gray-500">No recent feedback to display.</TextMd>
          )}
      </div>
      
    </div>
  );
};

export default FeedbackSection;