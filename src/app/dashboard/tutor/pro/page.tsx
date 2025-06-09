"use client";
import { Heading2, Heading3 } from "@/components/Heading"; // Assuming these exist
import { TextMd, TextSm } from "@/components/Text"; // Assuming this exists
import DashboardClick from "@/components/tutor-dashboard/DashboardSidebar"; // Assuming this exists
// import React, { useState, useEffect } from "react";
import Image from "next/image"; // For displaying profile image

export default function Pro() {
  return (
    <div className="h-screen w-full flex bg-[#F0FAF9] items-center">
      <div className="w-[15%] h-[85%] flex flex-col items-center">
        <DashboardClick/>
      </div>
      <div className="w-[75%] h-[85%] flex flex-col justify-center items-center">
        <Heading2 className="pb-4">Choose your plan</Heading2>
        <div className="w-[70%] h-[85%] flex justify-between">
          <div className="w-[45%] h-[100%] justify-center rounded-2xl flex flex-col items-center shadow-lg bg-white">
            <Heading3 className="h-[12%]">Free</Heading3>
            <div className="h-auto w-[80%] pb-6 flex justify-center border-b-2 b-black">
              <Heading3>Rp. 0/</Heading3>
              <TextMd className="flex items-end">mo</TextMd>
            </div>
            <div className="flex h-[60%] w-[80%] pt-6">
              <div className="mr-2">
                <Image 
                  src={'/assets/Check.png'}
                  alt={`v`}
                  width={30}
                  height={30}
                />
              </div>
              <TextMd>Basic profile visibility</TextMd>
            </div>
          </div>
          <div className="w-[45%] h-[100%] justify-center rounded-2xl flex flex-col items-center shadow-lg bg-white">
            <Heading3 className="h-[12%]">Pro</Heading3>
            <div className="h-auto w-[80%] pb-6 flex justify-center border-b-2 b-black">
              <Heading3>Rp. 50.000/</Heading3>
              <TextMd className="flex items-end">mo</TextMd>
            </div>
            <div className="flex flex-col justify-between items-center pt-6 h-[60%] w-[80%]">
              <div className="w-full flex">
                <div className="w-[15%] mr-2">
                  <Image 
                    src={'/assets/Check.png'}
                    alt={`v`}
                    width={30}
                    height={30}
                  />
                </div>
                <div>
                  <TextMd>Enhanced profile visibility with priority listing</TextMd>
                </div>
              </div>
              <div className="h-[15%] w-[70%] flex justify-center items-center bg-[#1F65A6] rounded-lg">
                <TextSm className="text-white">Choose plan</TextSm>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
