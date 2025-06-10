"use client";  

import { TextMd } from "@/components/Text";  
import { Heading1, Heading3, Heading4 } from "@/components/Heading";  
import React from "react";  
import Image from "next/image";
import { useTuteeForm } from "@/contexts/TuteeFormContext"; // Import the hook  
import { useRouter } from 'next/navigation'; // Import useRouter  

export default function TuteeForm() {  
  const { formData, updateFormData } = useTuteeForm(); // Use the context hook
  const router = useRouter(); // Initialize router

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    updateFormData({ [name]: value });
  };

  const handleContinue = () => {  
    router.push('/tutee-form/tutee-form1');  
  };

  return (  
    <div className="h-screen w-full flex">  
      <div className="w-[30%] bg-[#FFFFFF] flex items-center justify-center">  
        <Image   
          src="/assets/TuteeWelcome.png"  
          alt="Welcome"
          width={400}  
          height={0}  
        />  
      </div>  
      <div className="w-[70%] bg-[#F0FAF9]">  
        <div className="h-screen w-full">  
          <div className="h-[100%] flex flex-col justify-center items-center">  
              <Heading1 className="font-normal text-[3rem]">Let&apos;s get started! What&apos;s your name?</Heading1>
              <Heading3>This help up personalize your experience</Heading3>
              <div className="w-[75%] h-[10%] flex justify-between items-center mt-3">
                <div className="h-[100%] w-[48%] flex flex-col justify-around">
                  <Heading4>First Name</Heading4>
                  <input 
                    type="text"
                    name="firstName"
                    value={formData.firstName || ""}
                    onChange={handleInputChange}
                    className="bg-white h-[60%] w-[100%] border-2 border-[#999999] rounded-xl p-3 focus:outline-none"/>
                </div>
                <div className="h-[100%] w-[48%] flex flex-col justify-around">
                  <Heading4>Last Name</Heading4>
                  <input 
                    type="text" 
                    name="lastName"
                    value={formData.lastName || ""}
                    onChange={handleInputChange}
                    className="bg-white h-[60%] w-[100%] border-2 border-[#999999] rounded-xl p-3 focus:outline-none"/>
                </div>
              </div>
              
              <div className="w-[80%] grid grid-cols-3 gap-4 my-6 bg-amber-200">  
                 
              </div>  
            <div onClick={handleContinue}  className="w-[35%] h-[6%] bg-[#1F65A6] rounded-2xl flex justify-center items-center">  
              <TextMd className="text-white">Let&apos;s Go</TextMd>
            </div>  
          </div>  
        </div>  
      </div>  
    </div>  
  );  
}  