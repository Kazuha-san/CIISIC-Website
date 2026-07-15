import { auth } from "./lib/auth";
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

// NextAuth middleware check
const authMiddleware = auth((req: NextRequest & { auth?: { user?: { role?: string } } | null }) => {
  const { pathname } = req.nextUrl;

  // Allow public API routes without authentication check
  const isPublic = PUBLIC_API_PREFIXES.some((prefix) =>
    pathname.startsWith(prefix)
  );
  if (isPublic) {
    return NextResponse.next();
  }

  // Check if auth is required
  let requiresAuth = AUTH_REQUIRED_PREFIXES.some((prefix) =>
    pathname.startsWith(prefix)
  );

  // GET /api/challenges and GET /api/challenges/[id] are public
  if (pathname.startsWith("/api/challenges") && req.method === "GET") {
    requiresAuth = false;
  }

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

// Master middleware wrapper to handle CORS preflight and delegate session checks
export default async function middleware(req: NextRequest, event: any) {
  const { pathname } = req.nextUrl;

  const origin = req.headers.get("origin") || "";
  const allowedOrigins = [
    process.env.FRONTEND_URL,
    ...(process.env.ALLOWED_ORIGINS ? process.env.ALLOWED_ORIGINS.split(",") : []),
  ].filter((o): o is string => typeof o === "string")
   .map(o => o.trim());

  const isAllowedOrigin = allowedOrigins.includes(origin);
  const activeOrigin = isAllowedOrigin ? origin : (process.env.FRONTEND_URL || "");

  // 1. Handle CORS preflight OPTIONS requests early (prevents NextAuth interception)
  if (req.method === "OPTIONS") {
    const headers = new Headers();
    headers.set("Access-Control-Allow-Origin", activeOrigin);
    headers.set("Access-Control-Allow-Credentials", "true");
    headers.set("Access-Control-Allow-Methods", "GET,OPTIONS,PATCH,DELETE,POST,PUT");
    headers.set("Access-Control-Allow-Headers", "X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version, Authorization");
    return new NextResponse(null, { status: 204, headers });
  }

  // 2. Response helper to set CORS headers (avoid duplicating if already set by NextAuth wrapper)
  const withCors = (res: any) => {
    if (res && res.headers && res.headers.has("Access-Control-Allow-Origin")) {
      return res;
    }
    res.headers.set("Access-Control-Allow-Origin", activeOrigin);
    res.headers.set("Access-Control-Allow-Credentials", "true");
    res.headers.set("Access-Control-Allow-Methods", "GET,OPTIONS,PATCH,DELETE,POST,PUT");
    res.headers.set("Access-Control-Allow-Headers", "X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version, Authorization");
    return res;
  };

  // Skip NextAuth middleware execution for core auth endpoints to prevent double-execution and MissingCSRF errors
  const isCoreAuth = pathname.startsWith("/api/auth") && 
                     pathname !== "/api/auth/me" && 
                     pathname !== "/api/auth/change-password";

  if (isCoreAuth) {
    return withCors(NextResponse.next());
  }

  // 3. Execute NextAuth session parser and route protection
  const response = await authMiddleware(req, event);
  
  if (response) {
    return withCors(response);
  }
  return response;
}

export const config = {
  matcher: ["/api/:path*"],
};
