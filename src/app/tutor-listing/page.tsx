'use client';
import React, { useState } from 'react';
import { playfair } from '@/lib/fonts';
import CollapsibleSection from '@/components/CollapsableSection';
import Checkbox from '@/components/checkbox';
import Search from '@/components/search';
import Slider from '@/components/slider'
import BasicDateTimePicker from "@/components/DateTimePicker";
import dayjs, { Dayjs } from 'dayjs';
import TutorList from '@/components/TutorList';

const FilterTag = ({ label, onRemove }: { label: string, onRemove: () => void }) => (
  <div className="border border-[#a3a3a3] text-[13px] rounded-full px-3 flex items-center gap-1">
    {label}
    <button onClick={onRemove} className="text-black text-[20px] cursor-pointer">×</button>
  </div>
);

export default function page() {
  const [selectedSubjects, setSelectedSubjects] = useState<string[]>([]);
  const [selectedUniversities, setSelectedUniversities] = useState<string[]>([]);
  const [priceRange, setPriceRange] = useState<[number, number] | null>(null);
  const [selectedDateTime, setSelectedDateTime] = useState<Dayjs | null>(null);

  const toggleValue = (list: string[], setList: React.Dispatch<React.SetStateAction<string[]>>, value: string) => {
    setList(prev =>
      prev.includes(value) ? prev.filter(v => v !== value) : [...prev, value]
    );
  };

  const handleSliderChange = (range: [number, number]) => {
    setPriceRange(range);
  };

  return (
    <div className='container h-screen w-screen flex items-center justify-center bg-[#F0FAF9] gap-3 p-6'>

      {/* Filter */}
      <div className='h-screen w-[20vw] overflow-y-auto pr-2 scrollbar-hover'>
        <h1 className={`${playfair.className} text-[32px]`}>Filter</h1>

        {/* Filter Tags Section */}
        <div className="flex flex-wrap gap-2 mt-4">
          {selectedSubjects.map(subject => (
            <FilterTag key={subject} label={subject} onRemove={() => toggleValue(selectedSubjects, setSelectedSubjects, subject)} />
          ))}
          {selectedUniversities.map(uni => (
            <FilterTag key={uni} label={uni} onRemove={() => toggleValue(selectedUniversities, setSelectedUniversities, uni)} />
          ))}
          {priceRange && (
            <FilterTag
              label={`Rp. ${priceRange[0].toLocaleString()} - Rp. ${priceRange[1].toLocaleString()}`}
              onRemove={() => setPriceRange(null)}
            />
          )}
          {selectedDateTime && (
            <FilterTag
              label={`Date: ${dayjs(selectedDateTime).format('YYYY-MM-DD HH:mm')}`}
              onRemove={() => setSelectedDateTime(null)}
            />
          )}
        </div>

        <div className='flex flex-col gap-3'>
          {/* Subject Tab */}
          <CollapsibleSection title="Subject">

            <div className='relative'>
              <Search variant='sidebar' placeholder='Search Subjects...'/>
            </div>

            {["Discrete Mathematics", "Algorithm & Programming", "Linear Algebra", "Character Building", "Software Engineering"].map(label => (
              <Checkbox
                key={label}
                labels={[label]}
                selected={selectedSubjects}
                setSelected={(val) => toggleValue(selectedSubjects, setSelectedSubjects, label)}
              />
            ))}

            <p className='ml-4 mt-1 text-[13px] italic underline cursor-pointer'>58 more...</p>
            
          </CollapsibleSection>

          {/* Price Tab */}
          <CollapsibleSection title="Price">
            <Slider onChange={handleSliderChange} value={priceRange} />
          </CollapsibleSection>

          {/* Availability Tab */}
          <CollapsibleSection title="Availability">
            <BasicDateTimePicker onChange={setSelectedDateTime} value={selectedDateTime} />
          </CollapsibleSection>

          {/* University Tab */}
          <CollapsibleSection title="University">

            <div>
              {/* Search Button */}
              <div className='relative'>
                <Search variant='sidebar' placeholder='Search University...'/>
              </div>
              
              {/* CheckBox */}
              {["Bina Nusantara", "ITB", "UI", "UGM", "UPH"].map(label => (
                <Checkbox
                  key={label}
                  labels={[label]}
                  selected={selectedUniversities}
                  setSelected={(val) => toggleValue(selectedUniversities, setSelectedUniversities, label)}
                />
              ))}

              <p className='ml-4 mt-1 text-[13px] italic underline cursor-pointer'>58 more...</p>
            </div>
          </CollapsibleSection>
        </div>
      </div>

      {/* Content */}
      <div className='h-screen w-[80vw] overflow-y-auto pr-2 scrollbar-hover flex flex-col'>
        <h1 className={`${playfair.className} text-[48px] font-extrabold`}>Search Tutor</h1>
        <div className='relative'>
          <Search variant='content' placeholder=' '/>
        </div>

        <div className='bg-white h-[78vh] rounded-2xl shadow-md mt-4 p-4 pl-6 overflow-y-auto pr-5 scrollbar-hover'>
          <p className='text-[13px] mb-3'>6 Tutors Match Your Needs</p>
          <div className='flex flex-col gap-5'>
            <TutorList />
            <TutorList />
            <TutorList />
            <TutorList />
          </div>
        </div>
      </div>
    </div>
  )
}
