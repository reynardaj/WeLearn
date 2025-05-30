

import type { Metadata } from "next";
import "./globals.css";
import {
  ClerkProvider,
} from "@clerk/nextjs";
import { Playfair_Display, Open_Sans } from "next/font/google";
import ClientLayoutWrapper from "@/components/ClientLayoutWrapper";

const playfair = Playfair_Display({ weight: "700", subsets: ["latin"] });
const openSans = Open_Sans({ weight: "400", subsets: ["latin"] });

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ClerkProvider>
      <html lang="en">
        <body className="antialiased flex items-center justify-center min-h-screen">
          <main>
            <ClientLayoutWrapper>{children}</ClientLayoutWrapper>
          </main>
        </body>
      </html>
    </ClerkProvider>
  );
}
