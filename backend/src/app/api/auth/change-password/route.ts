import { NextRequest } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { verifyPassword, hashPassword } from "@/lib/password";
import { z } from "zod";
import { createAuditLog, getRequestMeta } from "@/lib/audit";
import {
  ok,
  badRequest,
  unauthorized,
  serverError,
  validationError,
} from "@/lib/api-response";

const ChangePasswordSchema = z.object({
  currentPassword: z.string().min(1, "Current password is required"),
  newPassword: z
    .string()
    .min(8, "Password must be at least 8 characters")
    .regex(/[A-Z]/, "Must contain an uppercase letter")
    .regex(/[0-9]/, "Must contain a number"),
});

/**
 * POST /api/auth/change-password
 * Authenticated users only — change own password.
 */
export async function POST(req: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user?.id) return unauthorized();

    const body = await req.json();
    const parsed = ChangePasswordSchema.safeParse(body);
    if (!parsed.success) return validationError(parsed.error.flatten());

    const { currentPassword, newPassword } = parsed.data;

    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
      select: { id: true, passwordHash: true },
    });

    if (!user?.passwordHash) {
      return badRequest("This account does not use password authentication");
    }

    const valid = await verifyPassword(currentPassword, user.passwordHash);
    if (!valid) {
      return badRequest("Current password is incorrect");
    }

    if (currentPassword === newPassword) {
      return badRequest("New password must differ from current password");
    }

    const newHash = await hashPassword(newPassword);
    await prisma.user.update({
      where: { id: user.id },
      data: { passwordHash: newHash },
    });

    const { ipAddress, userAgent } = getRequestMeta(req);
    await createAuditLog({
      userId: user.id,
      action: "ADMIN_ACTION",
      entityType: "User",
      entityId: user.id,
      newValue: { action: "PASSWORD_CHANGED" },
      ipAddress,
      userAgent,
    });

    return ok({ message: "Password changed successfully" });
  } catch (err) {
    console.error("[POST /api/auth/change-password]", err);
    return serverError();
  }
}
