import { auth } from "@/lib/auth";
import { NextResponse } from "next/server";
import { unauthorized } from "@/lib/api-response";

/**
 * GET /api/auth/login-redirect
 * Handles role-based redirection immediately after user login.
 */
export async function GET(req: Request) {
  const session = await auth();
  if (!session?.user) {
    return unauthorized("Authentication required");
  }

  const role = session.user.role;
  const baseUrl = new URL(req.url).origin;

  let redirectUrl = "/dashboard";
  if (role === "STUDENT") {
    redirectUrl = "/dashboard/student";
  } else if (role === "INDUSTRY_SPOC") {
    redirectUrl = "/dashboard/industry";
  } else if (role === "SUPER_ADMIN" || role === "CII_ADMIN") {
    redirectUrl = "/dashboard/admin";
  } else if (role === "INSTITUTION_SPOC") {
    redirectUrl = "/dashboard/institution";
  }

  return NextResponse.redirect(new URL(redirectUrl, baseUrl));
}
