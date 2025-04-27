import * as React from 'react';
import { playfair } from '@/lib/fonts';
import WeekDatePicker from '@/components/DatePicker';
import Picker from '@/components/ButtonPicker';

export default function page() {
  // Simulate data (you can replace this later with API fetch)
  const subjects = ['Algorithm & Programming', 'Math', 'Calculus'];
  const morningTimes = ['7:00', '8:00', '9:00'];
  const afternoonTimes = ['12:00', '13:00', '14:00'];
  const eveningTimes = ['17:00', '18:00'];

  return (
    <div className='min-h-screen w-full flex flex-col items-center justify-center' style={{ backgroundColor: 'rgba(0, 0, 0, 0.6)' }}>
      <div className='flex flex-col mt-10 mb-10 h-auto w-[90%] sm:w-[50%] md:w-[50%] lg:w-[40%] xl:w-[30%] rounded-2xl bg-[#F0FAF9] justify-start p-6 sm:p-8 md:p-10 lg:p-12 gap-5 overflow-visible'>
        
        <h1 className={`${playfair.className} text-[24px] text-center`}>Book A Session</h1>

        <WeekDatePicker />

        {/* Subject Section */}
        <div>
          <p className='text-[12px] mb-1'>Subject</p>
          <Picker options={subjects} />
        </div>

        {/* Morning Section */}
        <div>
          <p className='text-[12px] mb-1'>Morning</p>
          <Picker options={morningTimes} />
        </div>

        {/* Afternoon Section */}
        <div>
          <p className='text-[12px] mb-1'>Afternoon</p>
          <Picker options={afternoonTimes} />
        </div>

        {/* Evening Section */}
        <div>
          <p className='text-[12px] mb-1'>Evening</p>
          <Picker options={eveningTimes} />
        </div>

      </div>
    </div>
  );
}
