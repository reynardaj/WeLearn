import type { Metadata } from "next";
import "./globals.css";
import { Playfair_Display, Open_Sans } from "next/font/google";
import { Providers } from '@/components/Providers';  

const playfair = Playfair_Display({ weight: "700", subsets: ["latin"] });
const openSans = Open_Sans({ weight: "400", subsets: ["latin"] });

export const metadata: Metadata = {
  title: "WeLearn",
  description: "WeLearn",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${playfair.className} ${openSans.className} antialiased`}
      >
        <Providers>  
          {children}  
        </Providers>
      </body>
    </html>
  );
}
