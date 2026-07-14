import { NextRequest } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { z } from "zod";
import { createAuditLog, getRequestMeta } from "@/lib/audit";
import {
  ok,
  badRequest,
  forbidden,
  notFound,
  unauthorized,
  serverError,
  validationError,
} from "@/lib/api-response";

// ─── Per-role update schemas ──────────────────────────────────────────────────

const StudentProfileUpdateSchema = z.object({
  department: z.string().min(2).max(100).optional(),
  yearOfStudy: z.number().int().min(1).max(6).optional(),
  skills: z.array(z.string().max(50)).max(20).optional(),
});

const IndustryProfileUpdateSchema = z.object({
  companyName: z.string().min(2).max(200).optional(),
  industry: z.string().min(2).max(100).optional(),
  websiteUrl: z.string().url().optional().or(z.literal("")),
  logoUrl: z.string().url().optional().or(z.literal("")),
  isCIIMember: z.boolean().optional(),
});

const InstitutionProfileUpdateSchema = z.object({
  designation: z.string().min(2).max(100).optional(),
  department: z.string().min(2).max(100).optional(),
});

/**
 * GET /api/users/[id]/profile
 * Returns the role-specific profile for a user.
 * Self or admin can view.
 */
export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const session = await auth();
    if (!session?.user?.id) return unauthorized();

    const isAdmin =
      session.user.role === "SUPER_ADMIN" ||
      session.user.role === "CII_ADMIN";
    const isSelf = session.user.id === id;
    if (!isAdmin && !isSelf) return forbidden("Access denied");

    const user = await prisma.user.findUnique({
      where: { id },
      select: {
        id: true,
        role: true,
        studentProfile: {
          include: {
            institution: { select: { id: true, name: true, city: true, cellTheme: true } },
          },
        },
        industryProfile: true,
        institutionProfile: {
          include: {
            institution: { select: { id: true, name: true, city: true, cellTheme: true } },
          },
        },
      },
    });

    if (!user) return notFound("User not found");
    return ok(user);
  } catch (err) {
    console.error("[GET /api/users/[id]/profile]", err);
    return serverError();
  }
}

/**
 * PATCH /api/users/[id]/profile
 * Updates the role-specific profile for a user.
 * Self (own profile) or Admin can update.
 *
 * Students  → update: department, yearOfStudy, skills
 * Industry  → update: companyName, industry, websiteUrl, logoUrl, isCIIMember
 * Inst SPOC → update: designation, department
 */
export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const session = await auth();
    if (!session?.user?.id) return unauthorized();

    const isAdmin =
      session.user.role === "SUPER_ADMIN" ||
      session.user.role === "CII_ADMIN";
    const isSelf = session.user.id === id;
    if (!isAdmin && !isSelf) return forbidden("Access denied");

    const user = await prisma.user.findUnique({
      where: { id },
      select: {
        id: true,
        role: true,
        studentProfile: { select: { id: true } },
        industryProfile: { select: { id: true } },
        institutionProfile: { select: { id: true } },
      },
    });

    if (!user) return notFound("User not found");

    const body = await req.json();
    const { ipAddress, userAgent } = getRequestMeta(req);
    let updatedProfile;

    if (user.role === "STUDENT") {
      if (!user.studentProfile) {
        return badRequest("Student profile not found");
      }
      const parsed = StudentProfileUpdateSchema.safeParse(body);
      if (!parsed.success) return validationError(parsed.error.flatten());

      updatedProfile = await prisma.studentProfile.update({
        where: { id: user.studentProfile.id },
        data: {
          ...(parsed.data.department && { department: parsed.data.department }),
          ...(parsed.data.yearOfStudy !== undefined && {
            yearOfStudy: parsed.data.yearOfStudy,
          }),
          ...(parsed.data.skills && { skills: parsed.data.skills }),
        },
        include: {
          institution: { select: { id: true, name: true, city: true } },
        },
      });
    } else if (user.role === "INDUSTRY_SPOC") {
      if (!user.industryProfile) {
        return badRequest("Industry profile not found");
      }
      const parsed = IndustryProfileUpdateSchema.safeParse(body);
      if (!parsed.success) return validationError(parsed.error.flatten());

      updatedProfile = await prisma.industryProfile.update({
        where: { id: user.industryProfile.id },
        data: {
          ...(parsed.data.companyName && { companyName: parsed.data.companyName }),
          ...(parsed.data.industry && { industry: parsed.data.industry }),
          ...(parsed.data.websiteUrl !== undefined && {
            websiteUrl: parsed.data.websiteUrl || null,
          }),
          ...(parsed.data.logoUrl !== undefined && {
            logoUrl: parsed.data.logoUrl || null,
          }),
          ...(parsed.data.isCIIMember !== undefined && {
            isCIIMember: parsed.data.isCIIMember,
          }),
        },
      });
    } else if (user.role === "INSTITUTION_SPOC") {
      if (!user.institutionProfile) {
        return badRequest("Institution profile not found");
      }
      const parsed = InstitutionProfileUpdateSchema.safeParse(body);
      if (!parsed.success) return validationError(parsed.error.flatten());

      updatedProfile = await prisma.institutionProfile.update({
        where: { id: user.institutionProfile.id },
        data: {
          ...(parsed.data.designation && { designation: parsed.data.designation }),
          ...(parsed.data.department && { department: parsed.data.department }),
        },
        include: {
          institution: { select: { id: true, name: true, city: true } },
        },
      });
    } else {
      return badRequest(
        "SUPER_ADMIN and CII_ADMIN roles do not have a role-specific profile"
      );
    }

    await createAuditLog({
      userId: session.user.id,
      action: "ADMIN_ACTION",
      entityType: `${user.role}_Profile`,
      entityId: id,
      newValue: { updatedFields: Object.keys(body) },
      ipAddress,
      userAgent,
    });

    return ok(updatedProfile);
  } catch (err) {
    console.error("[PATCH /api/users/[id]/profile]", err);
    return serverError();
  }
}
