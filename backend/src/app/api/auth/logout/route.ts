import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { verifyToken } from "@/lib/auth";

const corsHeaders = (origin: string) => {
  const allowedOrigins = [
    process.env.FRONTEND_URL,
    ...(process.env.ALLOWED_ORIGINS ? process.env.ALLOWED_ORIGINS.split(",") : []),
  ].filter((o): o is string => typeof o === "string")
   .map(o => o.trim());

  const activeOrigin = allowedOrigins.includes(origin) ? origin : (process.env.FRONTEND_URL || "");

  return {
    "Access-Control-Allow-Origin": activeOrigin,
    "Access-Control-Allow-Credentials": "true",
    "Access-Control-Allow-Methods": "POST,OPTIONS",
    "Access-Control-Allow-Headers": "X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version, Authorization",
  };
};

export async function OPTIONS(req: NextRequest) {
  const origin = req.headers.get("origin") || "";
  return new NextResponse(null, {
    status: 204,
    headers: corsHeaders(origin),
  });
}

export async function POST(req: NextRequest) {
  const origin = req.headers.get("origin") || "";
  const headers = corsHeaders(origin);

  try {
    const authHeader = req.headers.get("authorization");
    if (authHeader?.startsWith("Bearer ")) {
      const token = authHeader.substring(7);
      const payload = await verifyToken(token);
      
      if (payload) {
        // Write audit log
        await prisma.auditLog.create({
          data: {
            userId: payload.id,
            action: "USER_LOGOUT",
            entityType: "User",
            entityId: payload.id,
            newValue: { email: payload.email },
          },
        }).catch(console.error);
      }
    }

    return NextResponse.json(
      { success: true },
      { status: 200, headers }
    );
  } catch (err: any) {
    console.error("[POST /api/auth/logout] error:", err);
    return NextResponse.json(
      { success: false, message: "An unexpected error occurred" },
      { status: 500, headers }
    );
  }
}
