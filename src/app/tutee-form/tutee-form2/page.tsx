"use client";  

import { TextMd } from "@/components/Text";  
import React from "react";  
import Image from "next/image";  
import Link from "next/link";  
import { useTuteeForm } from "@/contexts/TuteeFormContext";  
import { useRouter } from 'next/navigation';  

const educationLevels: string[] = [  
  'Highschool',   
  'Undergraduate',   
  'Bachelor',   
  'Master'  
];   

export default function TuteeForm2() {  
  const { formData, updateFormData } = useTuteeForm();  
  const router = useRouter();  

  const handleEducationSelect = (educationLevel: string) => {  
    updateFormData({ education: educationLevel });  
  };  

  const handleContinue = () => {  
    if (formData.education) {  
      router.push('/tutee-form/tutee-form3');  
    }  
  };  

  const handleSkip = () => {  
    updateFormData({ education: null });  
    router.push('/tutee-form/tutee-form3');  
  };  

  return (  
    <div className="h-screen w-full flex">  
      <div className="w-[30%] bg-[#FFFFFF] p-4 flex items-center justify-center">  
        <Image   
          src="/assets/TuteeFormPage2.png"  
          alt="Tutee Form"  
          width={500}  
          height={0}  
        />  
      </div>  
      <div className="w-[70%] bg-[#F0FAF9]">  
        <div className="h-screen w-full">  
          <div className="h-[15%] flex justify-center items-center">  
            <Link href="/tutee-form/tutee-form1" className="w-12 h-12 rounded-full bg-white border-2 border-[#1F65A6] flex justify-center items-center">  
              <Image   
                src="/assets/CheckList.png"  
                alt="done"  
                width={15}  
                height={0}  
              />  
            </Link>  

            <div className="w-[5%] border-1 border-[#1F65A6]"></div>  

            <Link href="/tutee-form/tutee-form2" className="w-12 h-12 rounded-full bg-[#1F65A6] border-2 border-[#1F65A6] flex justify-center items-center">  
              <TextMd className="text-white">2</TextMd>  
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
            <Link href={"/tutee-form/tutee-form1"}>  
              <Image   
                src="/assets/Arrow.png"  
                alt="Tutee Form"  
                width={30}  
                height={0}  
              />  
            </Link>  
          </div>  
          <div className="h-[70%] flex flex-col justify-center items-center">  
            <h1 className="font-normal text-[3rem]">What is your current education level?</h1>  
            <div className="w-[80%] h-[45%] gap-4 my-6 flex flex-col justify-between">  
            {educationLevels.map((educationLevel) => (  
              <div   
                key={educationLevel}  
                className={`  
                  h-[20%]   
                  flex   
                  items-center   
                  cursor-pointer   
                  px-3   
                  border-1   
                  rounded-xl  
                  ${formData.education === educationLevel   
                    ? 'bg-[#1F65A6] text-white border-[#1F65A6]'   
                    : 'bg-white text-black border-black'}  
                `}  
                onClick={() => handleEducationSelect(educationLevel)}  
              >  
                <div   
                  className={`  
                    w-5 h-5  
                    border  
                    rounded-full   
                    mr-2   
                    flex items-center justify-center  
                    ${formData.education === educationLevel   
                      ? 'border-white'   
                      : 'border-black'}  
                  `}  
                >  
                  {formData.education === educationLevel && (  
                    <div className={`  
                      w-3 h-3   
                      rounded-full  
                      ${formData.education === educationLevel   
                        ? 'bg-white'   
                        : 'bg-black'}  
                    `}></div>  
                  )}  
                </div>  
                <span>{educationLevel}</span>  
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
              className={`  
                w-30   
                h-10   
                rounded-full   
                flex   
                justify-center   
                items-center  
                cursor-pointer  
                ${formData.education   
                  ? 'bg-[#1F65A6] text-white'   
                  : 'bg-gray-300 text-gray-500'}  
              `}  
            >  
              <TextMd className={formData.education ? 'text-white' : 'text-gray-500'}>  
                Next  
              </TextMd>  
            </div>  
          </div>  
        </div>  
      </div>  
    </div>  
  );   
}  