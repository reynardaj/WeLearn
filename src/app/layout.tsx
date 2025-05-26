"use client";

import type { Metadata } from "next";
import "./globals.css";
import { ClerkProvider, SignedIn, SignedOut, SignInButton, UserButton, useAuth, useUser } from "@clerk/nextjs";
import { Playfair_Display, Open_Sans } from "next/font/google";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

const playfair = Playfair_Display({ weight: "700", subsets: ["latin"] });
const openSans = Open_Sans({ weight: "400", subsets: ["latin"] });

export const metadata: Metadata = {
  title: "WeLearn",
  description: "WeLearn",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
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
  const { isLoaded: authLoaded, userId } = useAuth();
  const { isLoaded: userLoaded, user } = useUser();
  const router = useRouter();

  useEffect(() => {
    if (authLoaded && userLoaded) {
      if (!userId || !user) return;

      const role = user.publicMetadata?.role;

      if (role === 'mentor') {
        router.replace('/mentor-dashboard');
      } else if (role === 'mentee') {
        router.replace('/mentee-dashboard');
      } else {
        router.replace('/onboarding');
      }
    }
  }, [authLoaded, userLoaded, userId, user, router]);

  return null;
}

