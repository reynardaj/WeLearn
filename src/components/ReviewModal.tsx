// components/ReviewModal.tsx
'use client';
import React, { useState } from 'react';

interface ReviewModalProps {
  tutorID: string;
  isOpen: boolean;
  onClose: () => void;
  onSubmit?: (data: { tutorID: string; rating: number; comment: string }) => void;
}

export default function ReviewModal({ tutorID, isOpen, onClose, onSubmit }: ReviewModalProps) {
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState('');

  if (!isOpen) return null;

  const handleSubmit = () => {
    if (onSubmit) onSubmit({ tutorID, rating, comment });
    setRating(0);
    setComment('');
    onClose();
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-[#f0faf9] rounded-2xl p-6 w-96 relative">
        <button
          aria-label="Close"
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-500 hover:text-gray-800"
        >
          &#10005;
        </button>

        <div className="flex space-x-4 mb-4">
          <div className="w-20 h-20 bg-gray-300 rounded-lg" /> {/* profile pic placeholder */}
          <div>
            <h2 className="text-xl font-bold">Reynard</h2>
            <p className="text-gray-700">Algorithm & Programming</p>
          </div>
        </div>

        <div className="flex space-x-1 mb-4">
          {[1,2,3,4,5].map((star) => (
            <button key={star} onClick={() => setRating(star)}>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6"
                viewBox="0 0 20 20"
                fill={star <= rating ? '#f4b660' : '#d1d5db'}
              >
                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.286 3.955a1 1 0 00.95.69h4.163c.969 0 1.371 1.24.588 1.81l-3.37 2.447a1 1 0 00-.364 1.118l1.287 3.955c.3.921-.755 1.688-1.54 1.118l-3.37-2.447a1 1 0 00-1.175 0l-3.37 2.447c-.785.57-1.84-.197-1.54-1.118l1.287-3.955a1 1 0 00-.364-1.118L2.07 9.382c-.783-.57-.38-1.81.588-1.81h4.163a1 1 0 00.95-.69l1.286-3.955z" />
              </svg>
            </button>
          ))}
        </div>

        <textarea
          className="w-full h-32 border border-black text-[#7f7f7f] rounded-lg p-2 mb-4 resize-none"
          placeholder="Share Your Experience"
          value={comment}
          onChange={(e) => setComment(e.target.value)}
        />

        <div className="flex justify-end space-x-2">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-lg bg-white text-gray-800 border"
          >
            Skip
          </button>
          <button
            onClick={handleSubmit}
            disabled={rating === 0 || comment.trim() === ''}
            className="px-4 py-2 rounded-lg bg-[#1f65a6] text-white disabled:opacity-50"
          >
            Continue
          </button>
        </div>
      </div>
    </div>
  );
}
