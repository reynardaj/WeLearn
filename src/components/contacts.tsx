import React from 'react'
import { playfair } from '@/lib/fonts';
import { Heading4 } from './Heading';
import { TextMd } from './Text';

interface ContactProps {
  name: string;
  lastMessage: string | null;
  selected?: boolean;
  profileimg: string;
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
  profileimg,
  onClick,
}: ContactProps) {
  const snippet = truncateWords(lastMessage, 5);
  const nameSnippet = truncateWords(name, 2);
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
      >
        <img
          src={profileimg}
          alt={`${name}`}
          className='object-cover h-full w-full rounded-2xl'
        />
      </div>
      <div className="flex flex-col justify-center overflow-hidden">
        <Heading4 className="truncate">
          {nameSnippet}
        </Heading4>
        <TextMd>
          {snippet}
        </TextMd>
      </div>
    </div>
  );
}
