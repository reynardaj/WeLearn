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

  return (
    <main>
      <div className="fixed top-4 right-4 z-50">
        <SignedIn>
          <UserButton />
        </SignedIn>
      </div>
      {children}
    </main>
  );
}