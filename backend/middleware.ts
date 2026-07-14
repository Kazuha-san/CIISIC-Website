import { auth } from "./src/lib/auth";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const PROTECTED_ROUTES: Record<string, string[]> = {
  "/api/admin": ["SUPER_ADMIN", "CII_ADMIN"],
  "/api/users": ["SUPER_ADMIN", "CII_ADMIN"],
  "/api/institutions": ["SUPER_ADMIN", "CII_ADMIN"],
};

const AUTH_REQUIRED_PREFIXES = [
  "/api/auth/me",
  "/api/auth/change-password",
  "/api/challenges",
  "/api/proposals",
  "/api/messages",
  "/api/notifications",
  "/api/admin",
  "/api/users",
  "/api/institutions",
  "/api/upload",
];

const PUBLIC_API_PREFIXES = [
  "/api/health",
  "/api/auth/register",
  "/api/auth/forgot-password",
  "/api/auth/reset-password",
  "/api/auth/signin",
  "/api/auth/signout",
  "/api/auth/session",
  "/api/auth/csrf",
  "/api/auth/providers",
  "/api/auth/callback",
  "/api/auth/error",
];

export default auth((req: NextRequest & { auth?: { user?: { role?: string } } | null }) => {
  const { pathname } = req.nextUrl;

  // Allow public API routes without authentication check
  const isPublic = PUBLIC_API_PREFIXES.some((prefix) =>
    pathname.startsWith(prefix)
  );
  if (isPublic) {
    return NextResponse.next();
  }

  // Check if auth is required
  const requiresAuth = AUTH_REQUIRED_PREFIXES.some((prefix) =>
    pathname.startsWith(prefix)
  );

  if (requiresAuth) {
    const session = req.auth;

    if (!session?.user) {
      return NextResponse.json(
        { success: false, message: "Authentication required" },
        { status: 401 }
      );
    }

    // Role-based protection for specific route prefixes
    for (const [route, roles] of Object.entries(PROTECTED_ROUTES)) {
      if (pathname.startsWith(route)) {
        const userRole = session.user.role;
        if (!userRole || !roles.includes(userRole)) {
          return NextResponse.json(
            { success: false, message: "Insufficient permissions" },
            { status: 403 }
          );
        }
        break;
      }
    }
  }

  return NextResponse.next();
});

export const config = {
  matcher: ["/api/:path*"],
};
