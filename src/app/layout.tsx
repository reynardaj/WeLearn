"use client"; // ✅ Must be a Client Component

import "./globals.css";
import { ClerkProvider, SignedIn, SignedOut, SignInButton, UserButton, useAuth } from "@clerk/nextjs";
import { Playfair_Display, Open_Sans } from "next/font/google";
import { useEffect } from "react";
import { useRouter } from "next/navigation";

const playfair = Playfair_Display({ weight: "700", subsets: ["latin"] });
const openSans = Open_Sans({ weight: "400", subsets: ["latin"] });

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClerkProvider>
      <AuthRedirectWrapper />
      <html lang="en">
        <body className="antialiased flex items-center justify-center min-h-screen">
          <main>
            <SignedOut>
              <SignInButton />
              {children}
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

function AuthRedirectWrapper() {
  const { userId, isLoaded } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (isLoaded && userId) {
      router.replace("/onboarding"); // ✅ Redirects only once
    }
  }, [isLoaded, userId, router]);

  return null;
}
