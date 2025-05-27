import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { headers } from "next/headers";

export default async function OnboardingLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { sessionClaims } = await auth();
  const role = sessionClaims?.metadata?.role;

  const headersList = await headers();
  const pathname = headersList.get("x-pathname") || "";

  // Only redirect if role exists AND we're on the onboarding page
  if (role && pathname === "/onboarding") {
    redirect(role === "mentor" ? "/mentor-dashboard" : "/mentee-dashboard");
  }

  return <>{children}</>;
}
