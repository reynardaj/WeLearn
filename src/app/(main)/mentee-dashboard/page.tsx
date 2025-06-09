'use client';
import React, { useState } from 'react';
import ReviewModal from '@/components/ReviewModal';
import { useAuth } from '@clerk/nextjs'; 

export default function TestReviewPage() {
  const [isOpen, setIsOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const { userId } = useAuth();

  const handleOpen = () => {
    setError(null); 
    setIsOpen(true);
  };
  
  const handleClose = () => setIsOpen(false);

  const handleReviewSubmit = async (data: { tutorID: string; rating: number; comment: string }) => {
    if (!userId) {
      setError("You must be logged in to submit a review.");
      return;
    }

    setIsSubmitting(true);
    setError(null);

    try {
      const reviewPayload = {
        tutorID: data.tutorID,
        rating: data.rating,
        comment: data.comment,
      };

      const response = await fetch('/api/reviews', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(reviewPayload),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to submit review.');
      }

      console.log('Review submitted successfully!');
      handleClose();

    } catch (err: any) {
      console.error('Submission error:', err);
      setError(err.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-4">Mentee Dashboard (Review Test)</h1>
      <button
        onClick={handleOpen}
        className="px-4 py-2 rounded-lg bg-[#1f65a6] text-white"
        disabled={isSubmitting}
      >
        {isSubmitting ? 'Submitting...' : 'Open Review Popup'}
      </button>

      {error && <p className="text-red-500 mt-2">{error}</p>}

      <ReviewModal
        tutorID="tutorIDtest1" // <-- FIX: Using the test tutorID you provided
        isOpen={isOpen}
        onClose={handleClose}
        onSubmit={handleReviewSubmit}
      />
    </div>
  );
}