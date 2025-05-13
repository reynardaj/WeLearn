"use client";  

import { TextMd } from "@/components/Text";  
import React from "react";  
import Image from "next/image";  
import Link from "next/link";  
import { useTuteeForm } from "@/contexts/TuteeFormContext"; // Import the hook  
import { useRouter } from 'next/navigation'; // Import useRouter  

const subjects: string[] = [  
  "Discrete Mathematics",  
  "Algorithm & Programming",   
  "Linear Algebra",   
  "Software Engineering",   
  "Calculus",   
  "Machine Learning"  
];  

export default function TuteeForm() {  
  const { formData, updateFormData } = useTuteeForm(); // Use the context hook  
  const router = useRouter(); // Initialize router  

  const handleSubjectClick = (subject: string) => {  
    const currentSubjects = formData.subjects || [];  
    const newSubjects = currentSubjects.includes(subject)  
      ? currentSubjects.filter(s => s !== subject)  
      : [...currentSubjects, subject];  
    
    updateFormData({ subjects: newSubjects });  
  };  

  const handleContinue = () => {  
    router.push('/tutee-form/tutee-form2');  
  };  

  const handleSkip = () => {  
    updateFormData({ subjects: [] }); // Set subjects to empty array if skipped  
    router.push('/tutee-form/tutee-form2');  
  };  

  return (  
    <div className="h-screen w-full flex">  
      <div className="w-[30%] bg-[#FFFFFF] flex items-center justify-center">  
        <Image   
          src="/assets/TuteeFormPage1.png"  
          alt="Tutee Form"  
          width={400}  
          height={0}  
        />  
      </div>  
      <div className="w-[70%] bg-[#F0FAF9]">  
        <div className="h-screen w-full">  
          <div className="h-[15%] flex justify-center items-center">  
            <Link href="/tutee-form/tutee-form1" className="w-12 h-12 rounded-full bg-[#1F65A6] border-2 border-[#1F65A6] flex justify-center items-center">  
              <TextMd className="text-white">1</TextMd>  
            </Link>  

            <div className="w-[5%] border-1 border-[#1F65A6]"></div>  
            
            <Link href="/tutee-form/tutee-form2" className="w-12 h-12 rounded-full bg-white border-2 border-[#1F65A6] flex justify-center items-center">  
              <TextMd>2</TextMd>  
            </Link>  
            
            <div className="w-[5%] border-1 border-[#1F65A6]"></div>  
            
            <Link href="/tutee-form/tutee-form3" className="w-12 h-12 rounded-full bg-white border-2 border-[#1F65A6] flex justify-center items-center">  
              <TextMd>3</TextMd>  
            </Link>   
            
            <div className="w-[5%] border-1 border-[#1F65A6]"></div>  
            
            <Link href="/tutee-form/tutee-form4" className="w-12 h-12 rounded-full bg-white border-2 border-[#1F65A6] flex justify-center items-center">  
              <TextMd>4</TextMd>  
            </Link>  

          </div>
          <div className="h-[5%] flex items-center pl-15">  
            <Link href={"/tutee-form"}>  
              <Image   
                src="/assets/Arrow.png"  
                alt="Tutee Form"  
                width={30}  
                height={0}  
              />  
            </Link>  
          </div>
          <div className="h-[70%] flex flex-col justify-center items-center">  
              <h1 className="font-normal text-[3rem]">Which subjects are you interested in?</h1>  
              <div className="w-[80%] grid grid-cols-3 gap-4 my-6">  
                {subjects.map((subject, index) => (  
                  <div   
                    key={index}  
                    onClick={() => handleSubjectClick(subject)}  
                    className={`  
                      rounded-lg   
                      p-4   
                      shadow-md   
                      hover:shadow-xl   
                      hover:scale-105   
                      transition-all   
                      duration-300   
                      cursor-pointer  
                      text-center  
                      ${formData.subjects?.includes(subject)   
                        ? 'bg-[#1F65A6] text-white'   
                        : 'bg-white text-black'}  
                    `}  
                  >  
                    {subject}  
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
          <div className="h-[10%] flex justify-end items-start pr-25">  
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