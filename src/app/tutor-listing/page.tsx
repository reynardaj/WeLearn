'use client';
import { useEffect, useState } from 'react';
import CollapsibleSection from '@/components/CollapsableSection';
import Checkbox from '@/components/checkbox';
import Search from '@/components/search';
import Slider from '@/components/slider';
import BasicDateTimePicker from '@/components/DateTimePicker';
import TutorList from '@/components/TutorList';
import dayjs, { Dayjs } from 'dayjs';
import BookingModal from '@/components/BookingModal';
import UpcomingSession from '@/components/UpcomingSession';
import { Button } from "@/components/button";
import { HiOutlineCalendarDays } from "react-icons/hi2";
import { Heading1, Heading2, Heading3 } from '@/components/Heading';
import { TextSm, TextMd } from '@/components/Text';

const FilterTag = ({ label, onRemove }: { label: string, onRemove: () => void }) => (
  <div className="border border-[#a3a3a3] text-[13px] rounded-full px-3 flex items-center gap-1">
    <TextSm>{label}</TextSm>
    <button onClick={onRemove} className="text-black text-[20px] cursor-pointer">×</button>
  </div>
);

export default function Page() {
  const [tutors, setTutors] = useState<any[]>([]);
  const [selectedSubjects, setSelectedSubjects] = useState<string[]>([]);
  const [selectedUniversities, setSelectedUniversities] = useState<string[]>([]);
  const [priceRange, setPriceRange] = useState<[number, number] | null>(null);
  const [selectedDateTime, setSelectedDateTime] = useState<Dayjs | null>(null);

  const [isSubjectExpanded, setIsSubjectExpanded] = useState(false);
  const [isUniversityExpanded, setIsUniversityExpanded] = useState(false);

  const [subjectSearchTerm, setSubjectSearchTerm] = useState('');
  const [universitySearchTerm, setUniversitySearchTerm] = useState('');
  const [tutorNameSearchTerm, setTutorNameSearchTerm] = useState('');

  const [showModal, setShowModal] = useState(false);
  const [selectedTutorID, setSelectedTutorID] = useState<string | null>(null);

  const [showUpcoming, setShowUpcoming] = useState(false);


  useEffect(() => {
    fetch('/api/tutor-listing')
      .then(res => res.json())
      .then(data => setTutors(data.tutors || []));
  }, []);

  const toggleValue = (list: string[], setList: React.Dispatch<React.SetStateAction<string[]>>, value: string) => {
    setList(prev =>
      prev.includes(value) ? prev.filter(v => v !== value) : [...prev, value]
    );
  };

  const handleSliderChange = (range: [number, number]) => {
    setPriceRange(range);
  };

  const allSubjects = Array.from(new Set(
    tutors.flatMap(tutor => tutor.subjects || [])
  ));

  const allUniversities = Array.from(new Set(
    tutors.map(tutor => tutor.institution)
  ));

  const filteredSubjects = allSubjects.filter(subject =>
    typeof subject === 'string' &&
    subject.toLowerCase().includes(subjectSearchTerm.toLowerCase())
  );

  const filteredUniversities = allUniversities.filter(uni =>
    uni.toLowerCase().includes(universitySearchTerm.toLowerCase())
  );

  const filteredTutors = tutors.filter(tutor => {
    const matchesSubjects = selectedSubjects.length === 0 || selectedSubjects.some(subject => (tutor.subjects || []).includes(subject));
    const matchesUniversities = selectedUniversities.length === 0 || selectedUniversities.includes(tutor.institution);
    const matchesPrice = !priceRange || (tutor.price >= priceRange[0] && tutor.price <= priceRange[1]);
    const matchesDateTime =
      !selectedDateTime ||
      (Array.isArray(tutor.availability) &&
        tutor.availability.some(slot => {
          const selectedDay = selectedDateTime.day();
          const selectedHour = selectedDateTime.hour();

          return slot.day === selectedDay && selectedHour >= parseInt(slot.startTime.split(':')[0]) && selectedHour < parseInt(slot.endTime.split(':')[0]);
        }));
    const matchesName = `${tutor.firstname} ${tutor.lastname}`.toLowerCase().includes(tutorNameSearchTerm.toLowerCase());

    return matchesSubjects && matchesUniversities && matchesPrice && matchesDateTime && matchesName;
  });

  return (
    <div className="flex flex-col lg:flex-row w-full min-h-screen bg-[#F0FAF9] gap-3 overflow-x-hidden">
      {/* Filter */}
      <div className="w-full lg:w-[30%] xl:w-[25vw] h-auto lg:h-screen overflow-y-auto p-5 scrollbar-hover mb-6 lg:mb-0">
        <Heading3>Filter</Heading3>

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

        <div className='flex flex-col'>
          {/* Subject Tab */}
          <CollapsibleSection title="Subject">
            <div className='relative'>
              <Search
                variant='sidebar'
                placeholder='Search Subjects...'
                value={subjectSearchTerm}
                onChange={(e) => setSubjectSearchTerm(e.target.value)}
              />
            </div>

            {(isSubjectExpanded ? filteredSubjects : filteredSubjects.slice(0, 5)).map(label => (
              <Checkbox
                key={label}
                labels={[label]}
                selected={selectedSubjects}
                setSelected={(val) => toggleValue(selectedSubjects, setSelectedSubjects, label)}
              />
            ))}

            {filteredSubjects.length > 5 && (
              <p
                className='ml-4 mt-1 text-[13px] italic underline cursor-pointer'
                onClick={() => setIsSubjectExpanded(prev => !prev)}
              >
                <TextSm>{isSubjectExpanded ? 'Show Less' : `${filteredSubjects.length - 5} more...`}</TextSm>
              </p>
            )}
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
            {/* Search Button */}
            <div className='relative'>
              <Search
                variant='sidebar'
                placeholder='Search University...'
                value={universitySearchTerm}
                onChange={(e) => setUniversitySearchTerm(e.target.value)}
              />
            </div>

            {(isUniversityExpanded ? filteredUniversities : filteredUniversities.slice(0, 5)).map(label => (
              <Checkbox
                key={label}
                labels={[label]}
                selected={selectedUniversities}
                setSelected={(val) => toggleValue(selectedUniversities, setSelectedUniversities, label)}
              />
            ))}

            {filteredUniversities.length > 5 && (
              <div
                className='ml-4 mt-1 text-[13px] italic underline cursor-pointer'
                onClick={() => setIsUniversityExpanded(prev => !prev)}
              >
                <TextSm>{isUniversityExpanded ? 'Show Less' : `${filteredUniversities.length - 5} more...`}</TextSm>
              </div>
            )}
          </CollapsibleSection>
        </div>
      </div>

      <div className="w-full h-screen lg:w-[70%] xl:w-[75vw] flex flex-col flex-1 overflow-y-auto scrollbar-hover p-6">
        <div className='flex items-center justify-between'>
          <Heading1>Search Tutor</Heading1>
          <div className="relative inline-block">
            <Button
              onClick={() => setShowUpcoming(true)}
              variant="secondary"
            >
              <div className="inline-flex items-center gap-2 justify-center">
                <HiOutlineCalendarDays className="text-[18px]" />
                <TextMd className='hidden sm:inline-block'>Upcoming Session</TextMd>
              </div>
            </Button>

            {showUpcoming && (
              <UpcomingSession onCloseAction={() => setShowUpcoming(false)} />
            )}
          </div>
        </div>
        <div className='relative'>
          <Search
            variant='content'
            placeholder='Search Tutors...'
            value={tutorNameSearchTerm}
            onChange={(e) => setTutorNameSearchTerm(e.target.value)}
          />
        </div>

        <div className='flex flex-col gap-5 bg-white h-[90%] rounded-2xl shadow-md mt-4 p-4 lg:pl-6 overflow-y-auto pr-5 scrollbar-hover'>
          <TextMd>{filteredTutors.length} Tutors Match Your Needs</TextMd>
          <div className='flex flex-col gap-5'>
            {filteredTutors.map(tutor => (
              <TutorList
                profileImage={tutor.profileimg} 
                key={tutor.tutorid}
                tutorID={tutor.tutorid}
                name={`${tutor.firstname} ${tutor.lastname}`}
                subjects={tutor.subjects || []}
                price={tutor.price}
                availability={tutor.availability || []}
                university={tutor.institution}
                rating={tutor.rating || 0}
                onBook={(id) => {
                  setSelectedTutorID(id);
                  setShowModal(true);
                }}
              />
            ))}
          </div>
          {showModal && selectedTutorID && (
            <BookingModal
              tutorID={selectedTutorID}
              onClose={() => {
                setShowModal(false);
                setSelectedTutorID(null);
              }}
            />
          )}
        </div>
      </div>
    </div>
  );
}
