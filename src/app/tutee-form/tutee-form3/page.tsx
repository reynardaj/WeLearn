"use client";  

import { TextMd } from "@/components/Text";  
import React from "react";  
import Image from "next/image";  
import Link from "next/link";  
import { useTuteeForm } from "@/contexts/TuteeFormContext";  
import { useRouter } from 'next/navigation';  

const days: string[] = [  
  "Monday",  
  "Tuesday",   
  "Wednesday",   
  "Thursday",   
  "Friday",   
  "Saturday",  
  "Sunday"  
];  

const times: string[] = [  
  "Morning",  
  "Afternoon",   
  "Evening",   
  "Night"  
];   

export default function TuteeForm3() {  
  const { formData, updateFormData } = useTuteeForm();  
  const router = useRouter();  

  const handleDayClick = (day: string) => {  
    const currentDays = formData.days || [];  
    const newDays = currentDays.includes(day)  
      ? currentDays.filter(d => d !== day)  
      : [...currentDays, day];  
    
    updateFormData({ days: newDays });  
  };  

  const handleTimeClick = (time: string) => {  
    const currentTimes = formData.times || [];  
    const newTimes = currentTimes.includes(time)  
      ? currentTimes.filter(t => t !== time)  
      : [...currentTimes, time];  
    
    updateFormData({ times: newTimes });  
  };  

  const handleContinue = () => {  
    router.push('/tutee-form/tutee-form4');  
  };  

  const handleSkip = () => {  
    updateFormData({ days: [], times: [] });  
    router.push('/tutee-form/tutee-form4');  
  };  

  return (  
    <div className="h-screen w-full flex flex-col sm:flex-row">  
      <div className="hidden sm:flex w-[30%] bg-[#FFFFFF] items-center justify-center">  
        <Image   
          src="/assets/TuteeFormPage3.png"  
          alt="Tutee Form"  
          width={400}  
          height={0}  
        />  
      </div>  
      <div className="w-full sm:w-[70%] bg-[#F0FAF9]">  
        <div className="h-full w-full flex flex-col justify-between py-6 overflow-y-auto space-y-10 md:space-y-0">  
          <div className="h-[15%] flex justify-center items-center">  
            <Link href="/tutee-form" className="w-12 h-12 rounded-full bg-white border-2 border-[#1F65A6] flex justify-center items-center">  
              <Image   
                src="/assets/CheckList.png"  
                alt="done"  
                width={15}  
                height={0}  
              />  
            </Link>   

            <div className="w-[5%] border-1 border-[#1F65A6]"></div>  
            
            <Link href="/tutee-form/tutee-form2" className="w-12 h-12 rounded-full bg-white border-2 border-[#1F65A6] flex justify-center items-center">  
              <Image   
                src="/assets/CheckList.png"  
                alt="done"  
                width={15}  
                height={0}  
              />  
            </Link>  
            
            <div className="w-[5%] border-1 border-[#1F65A6]"></div>  
            
            <Link href="/tutee-form/tutee-form3" className="w-12 h-12 rounded-full bg-[#1F65A6] border-2 border-[#1F65A6] flex justify-center items-center">  
              <TextMd className="text-white">3</TextMd>  
            </Link>  

            <div className="w-[5%] border-1 border-[#1F65A6]"></div>  
            
            <Link href="/tutee-form/tutee-form4" className="w-12 h-12 rounded-full bg-white border-2 border-[#1F65A6] flex justify-center items-center">  
              <TextMd>4</TextMd>  
            </Link>  

          </div>  
          <div className="h-[5%] flex items-center pl-5 md:pl-15">  
            <Link href={"/tutee-form/tutee-form2"}>  
              <Image   
                src="/assets/Arrow.png"  
                alt="Tutee Form"  
                width={30}  
                height={0}  
              />  
            </Link>  
          </div>  
          <div className="flex flex-col justify-start items-center px-4">  
              <h1 className="font-normal text-center text-[1.5rem] sm:text-[2rem] md:text-[2rem] lg:text-[2.5rem] xl:text-[3rem]">When can you take the course?</h1>  
              <div className="w-[80%] flex">  
                <h1 className="text-2xl">Days</h1>  
              </div>  
              <div className="w-[90%] grid grid-cols-2 md:grid-cols-3 gap-4 mt-2 mb-2">  
                {days.map((day) => (  
                  <div   
                    key={day}  
                    onClick={() => handleDayClick(day)}  
                    className={`  
                      rounded-xl   
                      p-2.5  
                      shadow-md   
                      hover:shadow-xl   
                      hover:scale-105   
                      transition-all   
                      duration-300   
                      cursor-pointer  
                      text-center  
                      ${formData.days?.includes(day)   
                        ? 'bg-[#1F65A6] text-white'   
                        : 'bg-white text-black'}  
                    `}  
                  >  
                    {day}  
                  </div>  
                ))}  
              </div>  
              <div className="w-[80%] flex">  
                <h1 className="text-2xl">Times</h1>  
              </div>  
              <div className="w-[90%] grid grid-cols-2 md:grid-cols-3 gap-4 mt-2 mb-4">  
                {times.map((time) => (  
                  <div   
                    key={time}  
                    onClick={() => handleTimeClick(time)}  
                    className={`  
                      rounded-lg   
                      p-2.5  
                      shadow-md   
                      hover:shadow-xl   
                      hover:scale-105   
                      transition-all   
                      duration-300   
                      cursor-pointer  
                      text-center  
                      ${formData.times?.includes(time)   
                        ? 'bg-[#1F65A6] text-white'   
                        : 'bg-white text-black'}  
                    `}  
                  >  
                    {time}  
                  </div>  
                ))}  
              </div>   
              <div   
                onClick={handleSkip}   
                className="w-[80%] bg-[#F4B660] rounded-xl p-3 flex justify-center items-center cursor-pointer"  
              >  
                <TextMd>Skip question</TextMd>  
              </div>  
          </div>  
          <div className="flex justify-center sm:justify-end items-center mt-4 px-6">  
            <div   
              onClick={handleContinue}  
              className="w-30 h-10 rounded-full bg-[#1F65A6] flex justify-center items-center cursor-pointer"  
            >  
              <TextMd className="text-white">Next</TextMd>  
            </div>  
          </div>  
        </div>  
      </div>  
    </div>  
  );  
}  