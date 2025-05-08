"use client";
import React, { useEffect, useState } from 'react'
import { playfair } from '@/lib/fonts';
import Rating from '@/components/rating'
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button'
import ProgressBar from '@/components/ProgressBar'
import ReviewList from '@/components/reviewList';
import { useSearchParams } from 'next/navigation';

interface TutorData {
  tutorid: string;
  firstname: string;
  lastname: string;
  institution: string;
  price: number;
  description: string;
  experience: string;
  profileimg: string;
  subjects: string[];
  availableDays: string[];
}

export default function page() {
  const searchParams = useSearchParams();
  const tutorID = searchParams.get('tutorID') || 'TUT001'; // fallback for testing

  const [tutor, setTutor] = useState<TutorData | null>(null);

  useEffect(() => {
    if (!tutorID) return;

    fetch(`/api/tutor-profile?tutorID=${tutorID}`)
      .then((res) => res.json())
      .then((data) => setTutor(data));
  }, [tutorID]);

  if (!tutor) return <div>Loading...</div>;
  
  return (
    <div className='flex flex-col min-h-screen w-full bg-[#F0FAF9] p-5 md:p-15 gap-5'>
      {/* Tutor Header */}
      <div className='flex flex-col md:flex-row lg:flex-row gap-5'>
        {/* Profile Picture */}
        <div className='bg-gray-300 h-[40vh] w-full md:w-[50vw] lg:w-[30vw] xl:h-[35vh] xl:w-[20vw] rounded-2xl'></div>

        {/* Tutor Information */}
        <div className='flex flex-col w-full'>
          <h1 className={`${playfair.className} text-[24px] lg:text-[32px]`}>{tutor.firstname} {tutor.lastname}</h1>
          <div className='flex flex-col'>
            <p className='text-[16px] lg:text-[18px]'>{tutor.experience}</p>
            <p className='text-[13px] lg:text-[14px]'>{tutor.subjects.join(', ')}</p>
            <p className='text-[13px] lg:text-[14px]'>Rp. {tutor.price} / hour</p>
            <p className='text-[13px] lg:text-[14px]'>{tutor.availableDays.join(', ')}</p>
            <p className='text-[13px] lg:text-[14px]'>{tutor.institution}</p>
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
        <p className='text-[14px]'>{tutor.description}</p>
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
