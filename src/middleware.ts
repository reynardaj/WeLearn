import {
  clerkMiddleware,
  createRouteMatcher,
  clerkClient,
} from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

// ini harus diadjust ke route yang sesuai
const isMentorRoute = createRouteMatcher(["/mentor-dashboard(.*)"]);
const isMenteeRoute = createRouteMatcher(["/mentee-dashboard(.*)"]);
const isPublicRoute = createRouteMatcher(["/", "/sign-in(.*)", "/sign-up(.*)"]);

type UserRole = "mentor" | "mentee";

export default clerkMiddleware(async (auth, req) => {
  const { userId, redirectToSignIn } = await auth();
  const client = await clerkClient();
  let user;
  if (userId) {
    user = await client.users.getUser(userId);
  }
  const userRole = user?.publicMetadata?.role as UserRole | undefined;
  
  const signInRoleRedirects = {
    mentor: "/dashboard/tutor",
    mentee: "/tutor-listing",
  };
  const isSignInCallback = req.nextUrl.pathname === '/';
  if (isSignInCallback && userRole) {
    return NextResponse.redirect(
      new URL(signInRoleRedirects[userRole], req.url)
    );
  }
  
  if (isPublicRoute(req)) {
    return NextResponse.next();
  }
  // TODO: implement protected routes
  // // Protect mentor routes
  // if (isMentorRoute(req)) {
  //   if (!userId) {
  //     return redirectToSignIn({ returnBackUrl: req.url });
  //   }

  //   if (userRole !== "mentor") {
  //     // Redirect authenticated users with wrong role to appropriate dashboard
  //     if (userRole === "mentee") {
  //       return NextResponse.redirect(new URL("/mentee-dashboard", req.url));
  //     }
  //     // Or redirect to a "no access" page
  //     return NextResponse.redirect(new URL("/unauthorized", req.url));
  //   }
  // }

  // // Protect mentee routes
  // if (isMenteeRoute(req)) {
  //   if (!userId) {
  //     return redirectToSignIn({ returnBackUrl: req.url });
  //   }

  //   if (userRole !== "mentee") {
  //     // Redirect authenticated users with wrong role to appropriate dashboard
  //     if (userRole === "mentor") {
  //       return NextResponse.redirect(new URL("/mentor-dashboard", req.url));
  //     }
  //     // Or redirect to a "no access" page
  //     return NextResponse.redirect(new URL("/unauthorized", req.url));
  //   }
  // }

  // Allow all other routes (including '/') to be accessed publicly
  return NextResponse.next();
});

export const config = {
  matcher: [
    "/((?!.*\\..*|_next).*)", // Existing matcher
    "/api/(.*)", // Added to ensure middleware applies to API routes
  ],
};
