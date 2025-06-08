"use client";
// import { Heading2, Heading3 } from "@/components/Heading"; // Assuming these exist
import { TextLg, TextMd } from "@/components/Text"; // Assuming this exists
import DashboardClick from "@/components/tutor-dashboard-performance/DashboardSidebar"; // Assuming this exists
// import React, { useState, useEffect } from "react";
import EarningOverview from '@/components/tutor-dashboard-performance/EarningOverview';


export default function Profile() {
  const tutorId = "998083f8-869a-44e8-b2eb-798aa9900274"; 
  return (
    <div className="h-screen w-full flex bg-[#F0FAF9] items-center">
      <div className="w-[15%] h-[85%] flex flex-col items-center">
        <DashboardClick/>
      </div>
      <div className="w-[85%] h-[85%] flex flex-col">
        <div className="w-[90%] h-[100%] bg-white rounded-2xl shadow-lg flex flex-col items-center p-4 space-y-4"> {/* Added padding & space-y */}
          
          {/* Total Earning Display */}
          <div className="w-full flex-shrink-0 pb-2 border-b"> {/* Use w-full */}
            <TextLg className="font-semibold">Total Earning</TextLg>
            <TextMd className="text-xl font-bold">Rp. {/* Fetch and display actual total earning here */}</TextMd>
          </div>
          
          {/* Earning Overview Section (Tabs and Chart) */}
          <div className="w-full flex-grow flex flex-col"> {/* Use flex-grow */}
            <TextMd className="font-medium flex-shrink-0 mb-1">Earning Overview</TextMd>
            <div className="flex-grow w-full"> {/* This div will give height to EarningOverview */}
              <EarningOverview tutorId={tutorId}/>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
