import React from 'react'
import Rating from '@/components/rating'
import { TextMd, TextSm } from './Text';

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
            <div className='bg-gray-300 w-10 sm:w-12 md:w-26 lg:w-20 xl:w-24 aspect-square rounded-2xl cursor-pointer'></div>
            <TextMd>{rev.name}</TextMd>
          </div>

          <div className='lg:w-[80vw]'>
            <Rating rating={rev.rating} color='yellow' />
            <TextSm>"{rev.comment}"</TextSm>
          </div>
        </div>
      ))}
    </>
  )
}
