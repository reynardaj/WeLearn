"use client";

import * as React from 'react';
import { playfair } from '@/lib/fonts';
import Rating from '@/components/TutorListingComponents/rating'
import Stack from '@mui/material/Stack';
import { Button } from "../button";
import { useRouter } from 'next/navigation';
import { Heading1, Heading2, Heading3, Heading4 } from '@/components/Heading';
import { TextSm, TextMd } from '@/components/Text';

interface AvailabilitySlot {
  day: number;
}
interface Props {
  tutorID: string;
  name: string;
  subjects: string[];
  price: number;
  university: string;
  availability: AvailabilitySlot[];
  rating: number;
  isPro: boolean;
  profileImage: string;
  onBook: (tutorID: string) => void;
}

export default function TutorList({ tutorID, name, subjects, price, university, availability, rating, isPro, profileImage, onBook }: Props) {
  const router = useRouter(); 
  const days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

  const uniqueDays = Array.from(new Set(availability.map(slot => slot.day)))
    .sort((a, b) => a - b)
    .map(dayIndex => days[dayIndex]);

  const goToChat = () => {
    router.push(`/message?tutorID=${tutorID}`);
  };

  const goToProfile = () => {
    router.push(`/tutor-profile?tutorID=${tutorID}`);
  };

  return (
    <div className='flex flex-col md:flex-row gap-5 w-full'>
      {/* Profile Picture */}
      <div onClick={goToProfile} className='bg-gray-300 w-28 sm:w-32 md:w-40 lg:w-48 xl:w-56 aspect-square rounded-2xl cursor-pointer'>
        <img
          src={profileImage}
          alt={`${name} profile`}
          className='object-cover h-full w-full rounded-2xl'
        />
      </div>

      {/* Tutor Information */}
      <div className='flex-1 flex flex-col w-full border-b-2 border-gray-300 pb-4'>
        <div className='flex gap-2 items-center'>
          <Heading3>
            {name}
          </Heading3>
          { isPro && (
            <div className='bg-[#F0FAF9] px-2 py-1 rounded-full border-2 border-[#B8B8B8]'>
              <TextSm>
                Pro Tutor
              </TextSm>
            </div>
          )}
          
        </div>
        <div onClick={goToProfile} className='flex flex-col cursor-pointer'>
            <TextMd>{subjects.join(', ')}</TextMd>
            <TextMd>{price.toLocaleString('id-ID')} / hour</TextMd>
            <TextMd>{uniqueDays.join(', ')}</TextMd>
            <TextMd>{university}</TextMd>
        </div>
        <Rating rating={rating}/>
        <div className='flex justify-center md:justify-end'>
            <Stack spacing={1} direction="row">
              <Button 
                variant="ghost" 
                onClick={goToChat}
                className='border-gray-300 border-1'
              >
                Send Message
              </Button>
              <Button 
                variant="primary" 
                onClick={() => onBook(tutorID)}
              >
                Book A Session
              </Button>
            </Stack>
        </div>
      </div>
    </div>
  )
}
