import * as React from 'react';
import { playfair } from '@/lib/fonts';
import Rating from '@/components/rating'
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';

interface Props {
    name: string;

}

export default function TutorList() {
  return (
    <div className='flex gap-5'>
        {/* Profile Picture */}
      <div className='bg-gray-300 h-[25vh] w-[10vw] rounded-2xl'></div>

        {/* Tutor Information */}
      <div className='flex flex-col w-full'>
        <h1 className={`${playfair.className} text-[32px]`}>Name</h1>
        <div>
            <p className='text-[14px]'>Subjects</p>
            <p className='text-[14px]'>Price</p>
            <p className='text-[14px]'>Availability</p>
            <p className='text-[14px]'>University</p>
        </div>
        <div className='mt-2 flex items-center justify-between'>
            <div className="flex items-center">
                <Rating />
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
