import { NextRequest } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { InstitutionUpdateSchema } from "@/lib/validations/institution";
import { createAuditLog, getRequestMeta } from "@/lib/audit";
import {
  ok,
  forbidden,
  notFound,
  unauthorized,
  serverError,
  validationError,
} from "@/lib/api-response";

/**
 * GET /api/institutions/[id]
 * Public — get a single institution with student count.
 */
export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    const institution = await prisma.institution.findUnique({
      where: { id },
      include: {
        _count: { select: { students: true } },
        institutionProfile: {
          include: {
            user: { select: { id: true, name: true, email: true } },
          },
        },
      },
    });

    if (!institution) return notFound("Institution not found");
    return ok(institution);
  } catch (err) {
    console.error("[GET /api/institutions/[id]]", err);
    return serverError();
  }
}

/**
 * PATCH /api/institutions/[id]
 * Admin only — update institution details.
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
    if (!isAdmin) return forbidden("Only admins can update institutions");

    const institution = await prisma.institution.findUnique({ where: { id } });
    if (!institution) return notFound("Institution not found");

    const body = await req.json();
    const parsed = InstitutionUpdateSchema.safeParse(body);
    if (!parsed.success) return validationError(parsed.error.flatten());

    const updated = await prisma.institution.update({
      where: { id },
      data: {
        ...(parsed.data.name && { name: parsed.data.name }),
        ...(parsed.data.city && { city: parsed.data.city }),
        ...(parsed.data.state && { state: parsed.data.state }),
        ...(parsed.data.logoUrl !== undefined && {
          logoUrl: parsed.data.logoUrl || null,
        }),
        ...(parsed.data.websiteUrl !== undefined && {
          websiteUrl: parsed.data.websiteUrl || null,
        }),
        ...(parsed.data.cellTheme && { cellTheme: parsed.data.cellTheme }),
        ...(parsed.data.spocUserId !== undefined && {
          spocUserId: parsed.data.spocUserId || null,
        }),
      },
    });

    const { ipAddress, userAgent } = getRequestMeta(req);
    await createAuditLog({
      userId: session.user.id,
      action: "INSTITUTION_UPDATED",
      entityType: "Institution",
      entityId: id,
      oldValue: { name: institution.name, cellTheme: institution.cellTheme },
      newValue: { name: updated.name, cellTheme: updated.cellTheme },
      ipAddress,
      userAgent,
    });

    return ok(updated);
  } catch (err) {
    console.error("[PATCH /api/institutions/[id]]", err);
    return serverError();
  }
}

/**
 * DELETE /api/institutions/[id]
 * Super Admin only — permanently deletes an institution (cascades).
 * Caution: this will fail if students are still linked.
 */
export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const session = await auth();
    if (!session?.user?.id) return unauthorized();
    if (session.user.role !== "SUPER_ADMIN") {
      return forbidden("Only super admins can delete institutions");
    }

    const institution = await prisma.institution.findUnique({ where: { id } });
    if (!institution) return notFound("Institution not found");

    await prisma.institution.delete({ where: { id } });

    const { ipAddress, userAgent } = getRequestMeta(req);
    await createAuditLog({
      userId: session.user.id,
      action: "INSTITUTION_DELETED",
      entityType: "Institution",
      entityId: id,
      oldValue: { name: institution.name },
      ipAddress,
      userAgent,
    });

    return ok({ message: "Institution deleted successfully" });
  } catch (err) {
    console.error("[DELETE /api/institutions/[id]]", err);
    return serverError();
  }
}
