import * as React from 'react';
import { playfair } from '@/lib/fonts';
import Rating from '@/components/rating'
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import dayjs from 'dayjs';

interface AvailabilitySlot {
  day: number;
}
interface Props {
  name: string;
  subjects: string[];
  price: number;
  university: string;
  availability: AvailabilitySlot[];
  rating: number;
}

export default function TutorList({ name, subjects, price, university, availability, rating }: Props) {
  const days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

  const uniqueDays = Array.from(new Set(availability.map(slot => slot.day)))
    .sort((a, b) => a - b)
    .map(dayIndex => days[dayIndex]);

  return (
    <div className='flex flex-col md:flex-row lg:flex-row gap-5'>
      {/* Profile Picture */}
      <div className='bg-gray-300 h-[40vh] w-full md:h-[25vh] md:w-[25vw] lg:w-[20vw] xl:w-[12vw] rounded-2xl'></div>

      {/* Tutor Information */}
      <div className='flex flex-col w-full'>
        <h1 className={`${playfair.className} text-[24px] lg:text-[32px]`}>{name}</h1>
        <div className='flex flex-col'>
            <p className='text-[13px] lg:text-[14px]'>{subjects.join(', ')}</p>
            <p className='text-[13px] lg:text-[14px]'>{price.toLocaleString('id-ID')} / hour</p>
            <p className='text-[13px] lg:text-[14px]'>{uniqueDays.join(', ')}</p>
            <p className='text-[13px] lg:text-[14px]'>{university}</p>
        </div>
        <div className='mt-3 flex flex-col md:flex-row lg:flex-row items-start lg:items-center justify-between gap-2'>
            <Rating rating={rating}/>
            <div>
                <Stack spacing={1} direction="row">
                  <Button variant="outlined" sx={{ fontSize: "12px", color: "black", borderRadius: "8px", borderColor: "#E4E4E7"}}>Send Message</Button>
                  <Button variant="contained" sx={{ fontSize: "12px", borderRadius: "8px", backgroundColor: "#1F65A6" }}>Book A Session</Button>
                </Stack>
            </div>
        </div>
      </div>
    </div>
  )
}
