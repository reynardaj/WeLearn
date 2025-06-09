// app/ClientLayoutWrapper.tsx (CLIENT COMPONENT)
"use client";

import {
  SignedIn,
  SignedOut,
  SignInButton,
  UserButton,
  useAuth,
  useUser,
} from "@clerk/nextjs";
import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function ClientLayoutWrapper({
  children,
}: {
  children: React.ReactNode;
}) {
  const { isLoaded: authLoaded, userId } = useAuth();
  const { isLoaded: userLoaded, user } = useUser();
  const router = useRouter();

  // Client-side redirection logic (can be simplified if using middleware)
  // useEffect(() => {
  //   if (authLoaded && userLoaded) {
  //     if (!userId || !user) {
  //       // User is not authenticated. Let them see the public content/sign-in button.
  //       // Clerk middleware typically handles redirecting to sign-in for protected routes.
  //       return;
  //     }

  //     const role = user.publicMetadata?.role;
  //     const currentPath = window.location.pathname; // Use window.location.pathname for client-side path

  //     // Only redirect if the user is not already on their correct dashboard/onboarding page
  //     if (role === "mentor" && currentPath !== "/mentor-dashboard") {
  //       router.replace("/mentor-dashboard");
  //     } else if (role === "mentee" && currentPath !== "/mentee-dashboard") {
  //       router.replace("/mentee-dashboard");
  //     } else if (!role && currentPath !== "/onboarding") {
  //       // If no role is assigned (and not already on onboarding), redirect to onboarding.
  //       // Consider if you want this to apply to *all* non-role pages, or just specific ones.
  //       // This is where middleware is far superior.
  //       router.replace("/onboarding");
  //     }
  //   }
  // }, [authLoaded, userLoaded, userId, user, router]);

  return (
    <main>
      <SignedOut>
        <SignInButton />
        {children}
      </SignedOut>

      <SignedIn>
        <div className="fixed top-4 right-4 z-50">
          <UserButton/>
        </div>
        {children}
      </SignedIn>
    </main>
  );
}
