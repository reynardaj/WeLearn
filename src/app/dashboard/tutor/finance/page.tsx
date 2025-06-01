"use client";
// import { Heading2, Heading3 } from "@/components/Heading"; // Assuming these exist
// import { TextMd } from "@/components/Text"; // Assuming this exists
import DashboardClick from "@/components/tutor-dashboard-performance/DashboardSidebar"; // Assuming this exists
// import React, { useState, useEffect } from "react";
// import Image from "next/image"; // For displaying profile image

export default function Profile() {
  return (
    <div className="h-screen w-full flex bg-[#F0FAF9] items-center">
      <div className="w-[15%] h-[85%] flex flex-col items-center">
        <DashboardClick/>
      </div>
      <div className="w-[85%] h-[85%] flex flex-col">
        <div className="w-[90%] h-[100%] justify-center bg-white rounded-2xl shadow-lg flex flex-col items-center">
          
        </div>
      </div>
    </div>
  );
}
