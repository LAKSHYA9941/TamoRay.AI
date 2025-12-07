// middleware.ts
import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const isPublicRoute = createRouteMatcher([
  "/",
  "/sign-in(.*)",
  "/sign-up(.*)",
  "/api/webhooks/clerk(.*)"
]);

export default clerkMiddleware(async (auth, req: NextRequest) => {
  const { userId } = await auth();

  // Set RLS context for authenticated users
  if (userId) {
    const response = NextResponse.next();

    // Set secure HTTP-only cookie with user ID
    response.cookies.set('clerk_user_id', userId, {
      httpOnly: true,
      sameSite: 'lax',
      secure: process.env.NODE_ENV === 'production',
    });

    // Redirect to dashboard if user is authenticated and on root route
    if (req.nextUrl.pathname === "/") {
      const dashboardUrl = req.nextUrl.clone();
      dashboardUrl.pathname = "/dashboard";
      return NextResponse.redirect(dashboardUrl);
    }

    return response;
  }

  // Handle unauthenticated users for protected routes
  if (!isPublicRoute(req)) {
    const signInUrl = new URL('/sign-in', req.url);
    signInUrl.searchParams.set('redirect_url', req.nextUrl.pathname);
    return NextResponse.redirect(signInUrl);
  }

  return NextResponse.next();
});

export const config = {
  matcher: ["/((?!.*\\..*|_next).*)", "/", "/(api|trpc)(.*)"],
};