import * as React from 'react';
import { playfair } from '@/lib/fonts';
import Rating from '@/components/rating'
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import dayjs from 'dayjs';

interface Props {
  name: string;
  subjects: string[];
  price: number;
  university: string;
  availability: string;
  rating: number;
}

export default function TutorList({ name, subjects, price, university, availability, rating }: Props) {
  return (
    <div className='flex gap-5'>
      {/* Profile Picture */}
      <div className='bg-gray-300 h-[25vh] w-[12vw] rounded-2xl'></div>

      {/* Tutor Information */}
      <div className='flex flex-col w-full'>
        <h1 className={`${playfair.className} text-[32px]`}>{name}</h1>
        <div>
            <p className='text-[14px]'>Subjects: {subjects.join(', ')}</p>
            <p className='text-[14px]'>Price: Rp. {price.toLocaleString('id-ID')}</p>
            <p className='text-[14px]'>Availability: {dayjs(availability).format('DD-MM-YYYY HH:mm')}</p>
            <p className='text-[14px]'>University: {university}</p>
        </div>
        <div className='mt-2 flex items-center justify-between'>
            <div className="flex items-center">
                <Rating rating={rating}/>
            </div>
            <div>
                <Stack spacing={2} direction="row">
                  <Button variant="outlined" sx={{ fontSize: "12px", color: "black", borderRadius: "8px", borderColor: "#E4E4E7"}}>Send Message</Button>
                  <Button variant="contained" sx={{ fontSize: "12px", borderRadius: "8px", backgroundColor: "#1F65A6" }}>Book A Session</Button>
                </Stack>
            </div>
        </div>
      </div>
    </div>
  )
}
