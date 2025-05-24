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
      className={[
        'h-[12vh] w-full p-4 flex gap-3 cursor-pointer transition mt-2',
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
