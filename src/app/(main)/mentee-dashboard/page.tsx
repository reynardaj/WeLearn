// import { Title } from "@/components/Heading";
// import { SignedIn, SignedOut, SignIn, UserButton } from "@clerk/clerk-react";

// export default function Home() {
//   return (
//     <div className="p-6">
//       <Title className="!text-primary">Mentee Dashboard</Title>
//     </div>
//   );
// }




// pages/test-review.tsx
'use client';
import React, { useState } from 'react';
import ReviewModal from '@/components/ReviewModal';

export default function TestReviewPage() {
  const [isOpen, setIsOpen] = useState(false);

  const handleOpen = () => setIsOpen(true);
  const handleClose = () => setIsOpen(false);

  const handleReviewSubmit = (data: { tutorID: string; rating: number; comment: string }) => {
    console.log('Submit review:', data);
  };

  return (
    <div className="p-8">
      <button
        onClick={handleOpen}
        className="px-4 py-2 rounded-lg bg-[#1f65a6] text-white"
      >
        Open Review Popup
      </button>

      <ReviewModal
        tutorID="test"  // TODO: replace with actual tutorID
        isOpen={isOpen}
        onClose={handleClose}
        onSubmit={handleReviewSubmit}
      />
    </div>
  );
}
