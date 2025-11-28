// middleware.ts
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  const adminPath = "/admin";
  const loginPath = "/admin/login";
  
  // Get the current path
  const path = request.nextUrl.pathname;

  // Check if the user is trying to access the admin area
  if (path.startsWith(adminPath)) {
    // If they are already on the login page, let them pass
    if (path === loginPath) {
      return NextResponse.next();
    }

    // Check for the admin cookie
    const adminCookie = request.cookies.get(
      process.env.COOKIE_NAME || "admin_session_token"
    );

    // If no cookie exists, redirect to login
    if (!adminCookie) {
      const url = request.nextUrl.clone();
      url.pathname = loginPath;
      return NextResponse.redirect(url);
    }
  }

  return NextResponse.next();
}

// Only run middleware on admin routes
export const config = {
  matcher: "/admin/:path*",
};