import { clerkMiddleware, createRouteMatcher } from '@clerk/nextjs/server';
import { NextResponse } from 'next/server';

// ini harus diadjust ke route yang sesuai
const isMentorRoute = createRouteMatcher(['/mentor-dashboard(.*)']);
const isMenteeRoute = createRouteMatcher(['/mentee-dashboard(.*)']);

export default clerkMiddleware(async (auth, req) => {
  const { userId, sessionClaims, redirectToSignIn } = await auth();

  // Protect mentor routes
  if (isMentorRoute(req)) {
    if (!userId || sessionClaims?.metadata?.role !== 'mentor') {
      return redirectToSignIn({ returnBackUrl: req.url });
    }
  }

  // Protect mentee routes
  if (isMenteeRoute(req)) {
    if (!userId || sessionClaims?.metadata?.role !== 'mentee') {
      return redirectToSignIn({ returnBackUrl: req.url });
    }
  }
  
  // Allow all other routes (including '/') to be accessed publicly
  return NextResponse.next();
});

// Updated matcher configuration to include API routes
export const config = {
  matcher: [
    '/((?!.*\\..*|_next).*)', // Existing matcher
    '/api/(.*)',              // Added to ensure middleware applies to API routes
  ],
};
