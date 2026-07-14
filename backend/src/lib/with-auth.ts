import { NextRequest, NextResponse } from "next/server";
import { auth } from "./auth";
import type { Role } from "@prisma/client";

export type AuthedRequest = NextRequest & {
  user: {
    id: string;
    email: string;
    name: string;
    role: Role;
    avatarUrl: string | null;
  };
};

type RouteHandler = (
  req: AuthedRequest,
  context: { params: Promise<Record<string, string>> }
) => Promise<NextResponse>;

/**
 * Wraps a route handler, injecting the authenticated user.
 * Returns 401 if no session, 403 if role not allowed.
 */
export function withAuth(
  handler: RouteHandler,
  allowedRoles?: Role[]
): (
  req: NextRequest,
  context: { params: Promise<Record<string, string>> }
) => Promise<NextResponse> {
  return async (req, context) => {
    try {
      const session = await auth();

      if (!session?.user?.id) {
        return NextResponse.json(
          { success: false, message: "Authentication required" },
          { status: 401 }
        );
      }

      if (
        allowedRoles &&
        !allowedRoles.includes(session.user.role as Role)
      ) {
        return NextResponse.json(
          { success: false, message: "You do not have permission" },
          { status: 403 }
        );
      }

      // Attach user to request
      const authedReq = req as AuthedRequest;
      authedReq.user = {
        id: session.user.id,
        email: session.user.email ?? "",
        name: session.user.name ?? "",
        role: session.user.role as Role,
        avatarUrl: session.user.avatarUrl,
      };

      return handler(authedReq, context);
    } catch (err) {
      console.error("[withAuth] Error:", err);
      return NextResponse.json(
        { success: false, message: "Internal server error" },
        { status: 500 }
      );
    }
  };
}
