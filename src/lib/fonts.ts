// lib/fonts.ts
import { Playfair_Display, Open_Sans } from 'next/font/google';

export const playfair = Playfair_Display({
  weight: '400',
  subsets: ['latin'],
  display: 'swap',
});

export const openSans = Open_Sans({
  weight: '400',
  subsets: ['latin'],
  display: 'swap',
});