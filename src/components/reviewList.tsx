import React from 'react'
import Rating from '@/components/rating'

export default function reviewList() {
  return (
    <div className='w-full flex flex-col lg:flex-row gap-2 border-b-2 border-gray-300 pb-10'>
      <div className='lg:w-[20vw] flex gap-5 items-center lg:items-start'>
        <div className='bg-gray-300 h-[10vh] w-[10vh] md:w-[10vw] lg:w-[10vw] xl:w-[6vw] rounded-2xl'></div>
        <p className='text-[18px] lg:text-[16px]'>Jensen Huang</p>
      </div>

      <div className='lg:w-[80vw]'>
        <Rating rating={5} color='yellow'/>
        <p className='font-medium'>"Reynard is hands-down the best tutor I’ve ever had! I was struggling with algebra, and he broke everything down so it actually made sense. He’s super patient and even makes math kinda fun. I went from failing to getting a B+ in just a few weeks. Highly recommend!"</p>
      </div>
    </div>
  )
}
