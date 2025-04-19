import { auth } from '@clerk/nextjs/server'
import { redirect } from 'next/navigation'

export default async function OnboardingLayout({ 
  children 
}: { 
  children: React.ReactNode 
}) {
  const { sessionClaims } = await auth()
  const role = sessionClaims?.metadata?.role
  
  // Only redirect if role exists AND we're on the onboarding page
  if (role && window.location.pathname === '/onboarding') {
    redirect(role === 'mentor' ? '/mentor-dashboard' : '/mentee-dashboard')
  }

  return <>{children}</>
}