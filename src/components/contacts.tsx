import React from 'react'
import { playfair } from '@/lib/fonts';

interface ContactProps {
  name: string;
  lastMessage: string;
  selected?: boolean;
  onClick?: () => void;
}

export default function Contact({
  name,
  lastMessage,
  selected = false,
  onClick,
}: ContactProps) {
  return (
    <div
      onClick={onClick}
      className={[
        'h-[12vh] w-full p-4 flex gap-3 cursor-pointer transition',
        selected
          ? 'bg-white shadow-md hover:bg-gray-50 rounded-xl'
          : 'hover:bg-gray-50'
      ].join(' ')}
    >
      <div
        className={[
          'w-[25%] h-full rounded-xl flex-shrink-0',
          selected ? 'bg-gray-300' : 'bg-gray-300'
        ].join(' ')}
      />
      <div className="flex flex-col justify-center overflow-hidden">
        <p className={`${playfair.className} text-[18px]`}>
          {name}
        </p>
        <p className="text-[12px]">
          {lastMessage}
        </p>
      </div>
    </div>
  );
}
