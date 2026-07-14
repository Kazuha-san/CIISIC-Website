import { NextRequest } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { z } from "zod";
import { createAuditLog, getRequestMeta } from "@/lib/audit";
import {
  ok,
  forbidden,
  notFound,
  unauthorized,
  serverError,
  validationError,
  badRequest,
} from "@/lib/api-response";

const UserUpdateSchema = z.object({
  name: z.string().min(2).max(100).optional(),
  isActive: z.boolean().optional(),
  role: z
    .enum(["SUPER_ADMIN", "CII_ADMIN", "INSTITUTION_SPOC", "INDUSTRY_SPOC", "STUDENT"])
    .optional(),
  avatarUrl: z.string().url().optional().or(z.literal("")),
});

/**
 * GET /api/users/[id]
 * Admin: see any user. User: see self only.
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
      include: {
        studentProfile: { include: { institution: true } },
        industryProfile: true,
        institutionProfile: { include: { institution: true } },
      },
    });
    if (!user) return notFound("User not found");

    const { passwordHash: _, ...safeUser } = user;
    return ok(safeUser);
  } catch (err) {
    console.error("[GET /api/users/[id]]", err);
    return serverError();
  }
}

/**
 * PATCH /api/users/[id]
 * Admin: update any user. Users can only update their own name/avatar.
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

    const user = await prisma.user.findUnique({ where: { id } });
    if (!user) return notFound("User not found");

    const body = await req.json();
    const parsed = UserUpdateSchema.safeParse(body);
    if (!parsed.success) return validationError(parsed.error.flatten());

    const data = parsed.data;

    // Non-admins cannot change role or isActive
    if (!isAdmin) {
      if (data.role !== undefined || data.isActive !== undefined) {
        return forbidden("You cannot change role or account status");
      }
    }

    const oldValue = { name: user.name, role: user.role, isActive: user.isActive };

    const updated = await prisma.user.update({
      where: { id },
      data: {
        ...(data.name && { name: data.name }),
        ...(isAdmin && data.isActive !== undefined && { isActive: data.isActive }),
        ...(isAdmin && data.role && { role: data.role }),
        ...(data.avatarUrl !== undefined && {
          avatarUrl: data.avatarUrl || null,
        }),
      },
    });

    const { ipAddress, userAgent } = getRequestMeta(req);
    const action = isAdmin && data.role
      ? "USER_ROLE_CHANGED"
      : isAdmin && data.isActive === false
      ? "USER_DEACTIVATED"
      : isAdmin && data.isActive === true
      ? "USER_ACTIVATED"
      : "ADMIN_ACTION";

    await createAuditLog({
      userId: session.user.id,
      action,
      entityType: "User",
      entityId: id,
      oldValue,
      newValue: { name: updated.name, role: updated.role, isActive: updated.isActive },
      ipAddress,
      userAgent,
    });

    const { passwordHash: _, ...safeUser } = updated;
    return ok(safeUser);
  } catch (err) {
    console.error("[PATCH /api/users/[id]]", err);
    return serverError();
  }
}

/**
 * DELETE /api/users/[id]
 * Super Admin only — permanently deletes a user.
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
      return forbidden("Only super admins can delete users");
    }
    if (session.user.id === id) {
      return badRequest("You cannot delete your own account");
    }

    const user = await prisma.user.findUnique({ where: { id } });
    if (!user) return notFound("User not found");

    await prisma.user.delete({ where: { id } });

    const { ipAddress, userAgent } = getRequestMeta(req);
    await createAuditLog({
      userId: session.user.id,
      action: "ADMIN_ACTION",
      entityType: "User",
      entityId: id,
      oldValue: { email: user.email, role: user.role },
      newValue: { deleted: true },
      ipAddress,
      userAgent,
    });

    return ok({ message: "User deleted successfully" });
  } catch (err) {
    console.error("[DELETE /api/users/[id]]", err);
    return serverError();
  }
}
