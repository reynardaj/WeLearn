import React from 'react'
import { playfair } from '@/lib/fonts';

interface ContactProps {
  name: string;
  lastMessage: string | null;
  selected?: boolean;
  onClick?: () => void;
}

function truncateWords(text: string | null | undefined, wordLimit: number) {
  if (!text) return '';                                                        // ← ADDED: guard null/undefined
  const words = text.split(' ');
  if (words.length <= wordLimit) return text;
  return words.slice(0, wordLimit).join(' ') + '...';
}

export default function Contact({
  name,
  lastMessage,
  selected = false,
  onClick,
}: ContactProps) {
  const snippet = truncateWords(lastMessage, 5);
  return (
    <div
      onClick={onClick}
      className={`
        w-full cursor-pointer transition flex flex-col items-center md:flex-row p-4 gap-2 sm:gap-3 mt-2
        ${selected
          ? 'bg-white shadow-md hover:bg-gray-50 rounded-xl'
          : 'hover:bg-gray-50'}
      `}
    >
      <div
        className={`
          bg-gray-300 rounded-xl flex-shrink-0 w-20 h-20 md:w-15 md:h-15
        `}
      />
      <div className="flex flex-col justify-center overflow-hidden">
        <p className={`${playfair.className} text-[18px] truncate`}>
          {name}
        </p>
        <p className="text-[12px]">
          {snippet}
        </p>
      </div>
    </div>
  );
}
