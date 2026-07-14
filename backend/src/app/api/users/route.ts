import { NextRequest } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { serializeUser } from "@/lib/serializers";
import {
  ok,
  unauthorized,
  forbidden,
  serverError,
} from "@/lib/api-response";

/**
 * GET /api/users
 * Admin only — list all users with optional filters.
 * Query: page, limit, role, search, isActive
 */
export async function GET(req: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user?.id) return unauthorized();

    const isAdmin =
      session.user.role === "SUPER_ADMIN" ||
      session.user.role === "CII_ADMIN";
    if (!isAdmin) return forbidden("Admin access required");

    const { searchParams } = new URL(req.url);
    const page = Math.max(1, parseInt(searchParams.get("page") ?? "1"));
    const limit = Math.min(100, parseInt(searchParams.get("limit") ?? "20"));
    const role = searchParams.get("role");
    const search = searchParams.get("search");
    const isActive = searchParams.get("isActive");
    const skip = (page - 1) * limit;

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const where: any = {};
    if (role) where.role = role;
    if (isActive !== null && isActive !== "") {
      where.isActive = isActive === "true";
    }
    if (search) {
      where.OR = [
        { name: { contains: search, mode: "insensitive" } },
        { email: { contains: search, mode: "insensitive" } },
      ];
    }

    const [total, users] = await Promise.all([
      prisma.user.count({ where }),
      prisma.user.findMany({
        where,
        skip,
        take: limit,
        orderBy: { createdAt: "desc" },
        include: {
          studentProfile: { select: { enrollmentNo: true, department: true } },
          industryProfile: { select: { companyName: true, industry: true } },
          institutionProfile: { select: { designation: true } },
        },
      }),
    ]);

    const serialized = users.map(({ passwordHash: _, ...u }) => u);

    return ok({
      data: serialized,
      pagination: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    });
  } catch (err) {
    console.error("[GET /api/users]", err);
    return serverError();
  }
}
