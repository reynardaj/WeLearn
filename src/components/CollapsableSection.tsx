"use client";
import { playfair } from '@/lib/fonts';
import React, { useState, useRef, useEffect } from 'react';
import { IoIosArrowDown, IoIosArrowForward } from "react-icons/io";

interface Props {
  title: string;
  children: React.ReactNode;
}

export default function CollapsibleSection({ title, children }: Props) {
  const [isOpen, setIsOpen] = useState(true);
  const contentRef = useRef<HTMLDivElement>(null);
  const [height, setHeight] = useState<string>("auto");

  useEffect(() => {
    if (contentRef.current) {
      const scrollHeight = contentRef.current.scrollHeight;
      setHeight(isOpen ? `${scrollHeight}px` : "0px");
    }
  }, [isOpen, children]);

  return (
    <div className='mb-4'>
      {/* Toggle header */}
      <div 
        className='flex items-center gap-2 cursor-pointer'
        onClick={() => setIsOpen(!isOpen)}
      >
        {isOpen ? <IoIosArrowDown /> : <IoIosArrowForward />}
        <h1 className={`${playfair.className} text-[20px]`}>{title}</h1>
      </div>

      {/* Animated content section */}
      <div
        ref={contentRef}
        style={{
          maxHeight: height,
          overflow: isOpen  ? 'visible' : 'hidden',
        }}
        className='transition-all duration-200 ease-in-out'
      >
        <div className='mt-1'>
          {children}
        </div>
      </div>
    </div>
  );
}
