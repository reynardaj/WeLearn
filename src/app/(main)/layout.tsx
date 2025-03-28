import type { Metadata } from "next";
import "./globals.css";
import { ClerkProvider, SignedIn, SignedOut, SignIn, SignInButton, UserButton } from "@clerk/nextjs";
import { Playfair_Display, Open_Sans } from "next/font/google";



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
    <ClerkProvider>
      <html lang="en">
        <body
          // className={`${geistSans.variable} ${geistMono.variable} antialiased flex items-center justify-center min-h-screen`}
          className={`antialiased flex items-center justify-center min-h-screen`}
        >
          <header>
          </header>
          <main>

            <SignedOut>
              <SignInButton />
            </SignedOut>

            <SignedIn>
              <UserButton />
              {children}
            </SignedIn>

          </main>
        </body>
      </html>
    </ClerkProvider>
  );
}
