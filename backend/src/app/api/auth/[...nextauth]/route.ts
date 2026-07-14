import { handlers } from "@/lib/auth";
import { NextRequest, NextResponse } from "next/server";

const corsHeaders = (req: NextRequest) => {
  const origin = req.headers.get("origin") || "";
  const allowedOrigins = [
    process.env.FRONTEND_URL,
    ...(process.env.ALLOWED_ORIGINS ? process.env.ALLOWED_ORIGINS.split(",") : []),
  ].filter((o): o is string => typeof o === "string")
   .map(o => o.trim());

  const activeOrigin = allowedOrigins.includes(origin) ? origin : (process.env.FRONTEND_URL || "");

  return {
    "Access-Control-Allow-Origin": activeOrigin,
    "Access-Control-Allow-Credentials": "true",
    "Access-Control-Allow-Methods": "GET,OPTIONS,PATCH,DELETE,POST,PUT",
    "Access-Control-Allow-Headers": "X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version, Authorization",
  };
};

const handleCors = async (req: NextRequest, handler: any) => {
  if (req.method === "OPTIONS") {
    return new NextResponse(null, {
      status: 204,
      headers: corsHeaders(req),
    });
  }

  const response = await handler(req);
  const headers = corsHeaders(req);

  try {
    Object.entries(headers).forEach(([key, value]) => {
      response.headers.set(key, value);
    });
    return response;
  } catch (e) {
    const newHeaders = new Headers();
    response.headers.forEach((val: string, k: string) => {
      newHeaders.set(k, val);
    });
    Object.entries(headers).forEach(([key, value]) => {
      newHeaders.set(key, value);
    });
    return new NextResponse(response.body, {
      status: response.status,
      statusText: response.statusText,
      headers: newHeaders,
    });
  }
};

export async function GET(req: NextRequest) {
  return handleCors(req, handlers.GET);
}

export async function POST(req: NextRequest) {
  return handleCors(req, handlers.POST);
}
