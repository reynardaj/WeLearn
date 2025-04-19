import { clerkMiddleware, createRouteMatcher } from '@clerk/nextjs/server'
import { NextResponse } from 'next/server'

// Define route matchers
const isMentorRoute = createRouteMatcher(['/mentor-dashboard(.*)'])
const isMenteeRoute = createRouteMatcher(['/mentee-dashboard(.*)'])

export default clerkMiddleware(async (auth, req) => {
  const { userId, sessionClaims, redirectToSignIn } = await auth()

  // Redirect to sign in if not authenticated
  if (!userId) {
    return redirectToSignIn({ returnBackUrl: req.url })
  }

  // Protect mentor routes
  if (isMentorRoute(req) && sessionClaims?.metadata?.role !== 'mentor') {
    const url = new URL('/', req.url)
    return NextResponse.redirect(url)
  }

  // Protect mentee routes
  if (isMenteeRoute(req) && sessionClaims?.metadata?.role !== 'mentee') {
    const url = new URL('/', req.url)
    return NextResponse.redirect(url)
  }
})

export const config = {
  matcher: ['/((?!.*\\..*|_next).*)', '/', '/(api|trpc)(.*)'],
}
