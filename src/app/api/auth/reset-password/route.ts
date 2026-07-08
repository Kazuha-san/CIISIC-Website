import { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { hashPassword } from "@/lib/password";
import { z } from "zod";
import { createAuditLog, getRequestMeta } from "@/lib/audit";
import {
  ok,
  badRequest,
  serverError,
  validationError,
} from "@/lib/api-response";

const ResetPasswordSchema = z.object({
  token: z.string().min(1, "Reset token is required"),
  newPassword: z
    .string()
    .min(8, "Password must be at least 8 characters")
    .regex(/[A-Z]/, "Must contain an uppercase letter")
    .regex(/[0-9]/, "Must contain a number"),
});

/**
 * POST /api/auth/reset-password
 * Public — validates reset token and updates the password.
 */
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const parsed = ResetPasswordSchema.safeParse(body);
    if (!parsed.success) return validationError(parsed.error.flatten());

    const { token, newPassword } = parsed.data;

    const resetToken = await prisma.passwordResetToken.findUnique({
      where: { token },
      include: {
        user: {
          select: { id: true, email: true, isActive: true, passwordHash: true },
        },
      },
    });

    // Generic error for all invalid/expired/used cases (security)
    const INVALID_MSG = "This reset link is invalid or has expired";

    if (!resetToken) return badRequest(INVALID_MSG);
    if (resetToken.usedAt) return badRequest(INVALID_MSG);
    if (new Date() > resetToken.expiresAt) return badRequest(INVALID_MSG);
    if (!resetToken.user.isActive) return badRequest(INVALID_MSG);

    const newHash = await hashPassword(newPassword);

    // Update password + mark token used in a transaction
    await prisma.$transaction([
      prisma.user.update({
        where: { id: resetToken.userId },
        data: { passwordHash: newHash },
      }),
      prisma.passwordResetToken.update({
        where: { id: resetToken.id },
        data: { usedAt: new Date() },
      }),
      // Invalidate all remaining active sessions by deleting them
      prisma.session.deleteMany({
        where: { userId: resetToken.userId },
      }),
    ]);

    const { ipAddress, userAgent } = getRequestMeta(req);
    await createAuditLog({
      userId: resetToken.userId,
      action: "ADMIN_ACTION",
      entityType: "User",
      entityId: resetToken.userId,
      newValue: { action: "PASSWORD_RESET_COMPLETED" },
      ipAddress,
      userAgent,
    });

    return ok({
      message: "Password reset successfully. Please sign in with your new password.",
    });
  } catch (err) {
    console.error("[POST /api/auth/reset-password]", err);
    return serverError();
  }
}
