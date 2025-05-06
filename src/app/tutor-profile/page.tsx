import React from 'react'
import { playfair } from '@/lib/fonts';
import Rating from '@/components/rating'
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button'
import ProgressBar from '@/components/ProgressBar'
import ReviewList from '@/components/reviewList';

export default function page() {
  return (
    <div className='flex flex-col min-h-screen w-full bg-[#F0FAF9] p-5 md:p-15 gap-5'>
      {/* Tutor Header */}
      <div className='flex flex-col md:flex-row lg:flex-row gap-5'>
        {/* Profile Picture */}
        <div className='bg-gray-300 h-[40vh] w-full md:w-[50vw] lg:w-[30vw] xl:h-[35vh] xl:w-[20vw] rounded-2xl'></div>

        {/* Tutor Information */}
        <div className='flex flex-col w-full'>
          <h1 className={`${playfair.className} text-[24px] lg:text-[32px]`}>Name</h1>
          <div className='flex flex-col'>
            <p className='text-[16px] lg:text-[18px]'>Teacher with 4 years of teaching experience and numerous successful
            examples.</p>
            <p className='text-[13px] lg:text-[14px]'>Subject</p>
            <p className='text-[13px] lg:text-[14px]'>Price / hour</p>
            <p className='text-[13px] lg:text-[14px]'>Days</p>
            <p className='text-[13px] lg:text-[14px]'>University</p>
          </div>
          <div className='mt-3 flex flex-col gap-1'>
              <Rating rating={5}/>
              <div>
                  <Stack spacing={1} direction="row">
                    <Button variant="contained" sx={{ fontSize: "12px", borderRadius: "8px", backgroundColor: "#1F65A6", padding: '10px' }}>Book A Session</Button>
                    <Button variant="outlined" sx={{ fontSize: "12px", color: "black", borderRadius: "8px", borderColor: "#E4E4E7", padding: '10px'}}>Send Message</Button>
                  </Stack>
              </div>
          </div>
        </div>
      </div>

      {/* About Me */}
      <div>
        <h1 className={`${playfair.className} text-[24px] lg:text-[32px]`}>About Me</h1>
        <p className='text-[14px]'>I’m a passionate tutor with over five years of experience helping students of all ages master their subjects. I specialize in math, science, and writing, but I love tackling any challenge a student throws my way. My teaching style is patient, creative, and tailored to each learner’s needs—whether you’re prepping for exams or just want to boost your confidence. When I’m not tutoring, you’ll find me reading sci-fi novels or experimenting with new recipes. Let’s work together to make learning fun and effective!"</p>
      </div>

      {/* Review Section */}
      <div>
        <h1 className={`${playfair.className} text-[24px] lg:text-[32px]`}>What my students say</h1>
        <div className='flex flex-col md:flex-row gap-5 mt-3'>
          {/* Rating */}
          <div className='flex flex-col gap-3 md:w-[25vw] lg:w-[20vw]'>
            <h1 className={`${playfair.className} text-[24px] lg:text-[32px]`}>5</h1>
            <Rating rating={5} color='yellow'/>
            <p className='text-[14px]'>24 reviews</p>
            <div className='flex flex-col'>
              <ProgressBar />
              <ProgressBar />
              <ProgressBar />
              <ProgressBar />
              <ProgressBar />
            </div>
            <Button variant="contained" sx={{ fontSize: "12px", color: 'black', borderRadius: "8px", backgroundColor: "#F4B660", padding: '10px' }} className='w-full lg:w-[13vw] xl:w-[10vw]'>Write A Review</Button>
          </div>

          {/* Review */}
          <div className='bg-white rounded-2xl shadow-md p-5 md:p-7 flex flex-col gap-9 h-[100vh] md:w-[75vw] lg:w-[80vw] overflow-y-auto scrollbar-hover'>
            <ReviewList />
            <ReviewList />
            <ReviewList />
            <ReviewList />
            <ReviewList />
            <ReviewList />
            <ReviewList />
            <ReviewList />
            <ReviewList />
            <ReviewList />
            <ReviewList />
            <ReviewList />
            <ReviewList />
          </div>
        </div>
      </div>
    </div>
  )
}
