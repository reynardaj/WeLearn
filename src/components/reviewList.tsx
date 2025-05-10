import React from 'react'
import Rating from '@/components/rating'

interface ReviewItem {
  name: string;
  comment: string;
  rating: number;
}

export default function reviewList({ reviews }: { reviews: ReviewItem[] }) {
  return (
    <>
      {reviews.map((rev, idx) => (
        <div key={idx} className='w-full flex flex-col lg:flex-row gap-2 border-b-2 border-gray-300 pb-10'>
          <div className='lg:w-[20vw] flex gap-5 items-center lg:items-start'>
            <div className='bg-gray-300 h-[10vh] w-[10vh] md:w-[10vw] lg:w-[10vw] xl:w-[6vw] rounded-2xl'></div>
            <p className='text-[18px] lg:text-[16px]'>Name</p>
          </div>

          <div className='lg:w-[80vw]'>
            <Rating rating={rev.rating} color='yellow' />
            <p className='font-medium'>"{rev.comment}"</p>
          </div>
        </div>
      ))}
    </>
  )
}
