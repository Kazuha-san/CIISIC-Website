import { NextRequest } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import {
  InstitutionCreateSchema,
} from "@/lib/validations/institution";
import { createAuditLog, getRequestMeta } from "@/lib/audit";
import {
  ok,
  created,
  unauthorized,
  forbidden,
  serverError,
  validationError,
  conflict,
} from "@/lib/api-response";

/**
 * GET /api/institutions
 * Public — anyone can list institutions.
 * Query: page, limit, cellTheme, search
 */
export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const page = Math.max(1, parseInt(searchParams.get("page") ?? "1"));
    const limit = Math.min(100, parseInt(searchParams.get("limit") ?? "20"));
    const cellTheme = searchParams.get("cellTheme");
    const search = searchParams.get("search");
    const skip = (page - 1) * limit;

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const where: any = {};
    if (cellTheme) where.cellTheme = cellTheme;
    if (search) {
      where.OR = [
        { name: { contains: search, mode: "insensitive" } },
        { city: { contains: search, mode: "insensitive" } },
      ];
    }

    const [total, institutions] = await Promise.all([
      prisma.institution.count({ where }),
      prisma.institution.findMany({
        where,
        skip,
        take: limit,
        orderBy: { name: "asc" },
        include: {
          _count: { select: { students: true } },
        },
      }),
    ]);

    return ok({
      data: institutions,
      pagination: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    });
  } catch (err) {
    console.error("[GET /api/institutions]", err);
    return serverError();
  }
}

/**
 * POST /api/institutions
 * Admin only — create a new institution.
 */
export async function POST(req: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user?.id) return unauthorized();

    const isAdmin =
      session.user.role === "SUPER_ADMIN" ||
      session.user.role === "CII_ADMIN";
    if (!isAdmin) return forbidden("Only admins can create institutions");

    const body = await req.json();
    const parsed = InstitutionCreateSchema.safeParse(body);
    if (!parsed.success) return validationError(parsed.error.flatten());

    const data = parsed.data;

    const existing = await prisma.institution.findUnique({
      where: { name: data.name },
    });
    if (existing) return conflict("An institution with this name already exists");

    const institution = await prisma.institution.create({
      data: {
        name: data.name,
        city: data.city,
        state: data.state ?? "Madhya Pradesh",
        logoUrl: data.logoUrl || null,
        websiteUrl: data.websiteUrl || null,
        cellTheme: data.cellTheme,
        spocUserId: data.spocUserId || null,
      },
    });

    const { ipAddress, userAgent } = getRequestMeta(req);
    await createAuditLog({
      userId: session.user.id,
      action: "INSTITUTION_CREATED",
      entityType: "Institution",
      entityId: institution.id,
      newValue: { name: institution.name },
      ipAddress,
      userAgent,
    });

    return created(institution);
  } catch (err) {
    console.error("[POST /api/institutions]", err);
    return serverError();
  }
}
