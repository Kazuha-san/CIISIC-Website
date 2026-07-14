import { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { z } from "zod";
import crypto from "crypto";
import {
  ok,
  badRequest,
  serverError,
  validationError,
} from "@/lib/api-response";
import { sendPasswordResetEmail } from "@/lib/email";

const ForgotPasswordSchema = z.object({
  email: z.string().email("Invalid email address"),
});

const RESET_TOKEN_TTL_MINUTES = 60; // 1 hour

/**
 * POST /api/auth/forgot-password
 * Public — generates a password reset token.
 *
 * NOTE: Email delivery is stubbed. When Nodemailer is integrated,
 * replace the console.log block with the actual email send call.
 */
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const parsed = ForgotPasswordSchema.safeParse(body);
    if (!parsed.success) return validationError(parsed.error.flatten());

    const { email } = parsed.data;

    // Always return 200 to avoid leaking which emails are registered
    const user = await prisma.user.findUnique({
      where: { email },
      select: { id: true, email: true, name: true, isActive: true },
    });

    if (!user || !user.isActive) {
      // Return success regardless to prevent email enumeration
      return ok({
        message:
          "If an account with that email exists, a reset link has been sent.",
      });
    }

    // Invalidate all previous unused tokens for this user
    await prisma.passwordResetToken.deleteMany({
      where: { userId: user.id, usedAt: null },
    });

    // Generate a cryptographically secure token
    const token = crypto.randomBytes(32).toString("hex");
    const expiresAt = new Date(
      Date.now() + RESET_TOKEN_TTL_MINUTES * 60 * 1000
    );

    await prisma.passwordResetToken.create({
      data: {
        userId: user.id,
        token,
        expiresAt,
      },
    });

    const resetUrl = `${process.env.NEXTAUTH_URL ?? "http://localhost:3000"}/api/auth/reset-password?token=${token}`;

    try {
      await sendPasswordResetEmail(user.email, user.name, resetUrl);
    } catch (err) {
      console.error("[ForgotPassword] Failed to send email, proceeding anyway:", err);
    }

    return ok({
      message:
        "If an account with that email exists, a reset link has been sent.",
      // Only expose token in development for testing without email
      ...(process.env.NODE_ENV === "development" && {
        _dev_token: token,
        _dev_resetUrl: resetUrl,
      }),
    });
  } catch (err) {
    console.error("[POST /api/auth/forgot-password]", err);
    return serverError();
  }
}
