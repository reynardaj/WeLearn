import React from 'react'
import { IoIosSearch } from "react-icons/io";
import { Heading1, Heading2, Heading3, Heading4 } from '@/components/Heading';
import { TextSm } from '@/components/Text';

interface Props {
  labels?: string[];
  borderColor?: string[];
  width?: number;
  variant?: "sidebar" | "content";
  placeholder?: string;
  value?: string;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

export default function Search({ variant = "sidebar", placeholder = "Search...", value, onChange }: Props) {
  const inputClasses =
    variant === "content"
      ? "pl-10 pr-10 py-2 w-full border-2 border-[#1F65A6] focus:border-[#1F65A6] focus:outline-none rounded-xl font-[Open_Sans] text-[0.81rem]"
      : "pl-10 pr-10 py-1 border-2 border-[#1F252D] rounded-2xl mt-1 placeholder:text-[13cpx] placeholder:text-black font-[Open_Sans] text-[0.81rem]";
    
  const inputColors = 
    variant === "content"
      ? "absolute left-2 top-1.5 text-3xl text-[#1F65A6]"
      : "absolute left-3 top-2.5 text-2xl"

  return (
    <div className="relative">
      <input
        type="text"
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        className={inputClasses}
      />
      <IoIosSearch className={inputColors} />
    </div>
  );
}

