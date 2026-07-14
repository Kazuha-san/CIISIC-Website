import { NextRequest } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { ChallengeUpdateSchema } from "@/lib/validations/challenge";
import { createAuditLog, getRequestMeta } from "@/lib/audit";
import { serializeChallenge } from "@/lib/serializers";
import {
  ok,
  forbidden,
  notFound,
  unauthorized,
  serverError,
  validationError,
} from "@/lib/api-response";

const CHALLENGE_INCLUDE = {
  industryProfile: {
    select: {
      id: true,
      userId: true,
      companyName: true,
      industry: true,
      logoUrl: true,
      isCIIMember: true,
    },
  },
  _count: { select: { proposals: true } },
} as const;

/**
 * GET /api/challenges/[id]
 * Anyone can view OPEN challenges. Admins see all statuses.
 * Increments view count for students/public.
 */
export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const session = await auth();
    const role = session?.user?.role;
    const userId = session?.user?.id;

    const challenge = await prisma.challenge.findUnique({
      where: { id },
      include: CHALLENGE_INCLUDE,
    });

    if (!challenge) return notFound("Challenge not found");

    // Non-admins only see OPEN challenges
    const isAdmin = role === "SUPER_ADMIN" || role === "CII_ADMIN";
    const isOwner =
      role === "INDUSTRY_SPOC" &&
      challenge.industryProfile.userId === userId;

    if (!isAdmin && !isOwner && challenge.status !== "OPEN") {
      return notFound("Challenge not found");
    }

    // Increment view count (fire-and-forget)
    if (!isAdmin && !isOwner) {
      prisma.challenge
        .update({ where: { id }, data: { viewCount: { increment: 1 } } })
        .catch(console.error);
    }

    return ok(serializeChallenge(challenge, (role as never) ?? "STUDENT", userId));
  } catch (err) {
    console.error("[GET /api/challenges/[id]]", err);
    return serverError();
  }
}

/**
 * PATCH /api/challenges/[id]
 * Industry SPOC (own challenge) or Admin can update.
 */
export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const session = await auth();
    if (!session?.user?.id) return unauthorized();

    const challenge = await prisma.challenge.findUnique({
      where: { id },
      include: { industryProfile: { select: { userId: true } } },
    });
    if (!challenge) return notFound("Challenge not found");

    const isAdmin =
      session.user.role === "SUPER_ADMIN" ||
      session.user.role === "CII_ADMIN";
    const isOwner =
      session.user.role === "INDUSTRY_SPOC" &&
      challenge.industryProfile.userId === session.user.id;

    if (!isAdmin && !isOwner) {
      return forbidden("You cannot edit this challenge");
    }

    const body = await req.json();
    const parsed = ChallengeUpdateSchema.safeParse(body);
    if (!parsed.success) return validationError(parsed.error.flatten());

    const data = parsed.data;

    const updated = await prisma.challenge.update({
      where: { id },
      data: {
        ...(data.title && { title: data.title }),
        ...(data.description && { description: data.description }),
        ...(data.problemStatement && { problemStatement: data.problemStatement }),
        ...(data.domain && { domain: data.domain }),
        ...(data.deadline && { deadline: new Date(data.deadline) }),
        ...(data.budgetRange !== undefined && { budgetRange: data.budgetRange }),
        ...(data.tags && { tags: data.tags }),
        ...(data.attachmentUrls && { attachmentUrls: data.attachmentUrls }),
        ...(data.status && {
          status: data.status,
          publishedAt:
            data.status === "OPEN" && !challenge.publishedAt
              ? new Date()
              : challenge.publishedAt,
        }),
      },
    });

    const { ipAddress, userAgent } = getRequestMeta(req);
    const auditAction = data.status === "PENDING_APPROVAL"
      ? "CHALLENGE_SUBMITTED"
      : data.status
      ? "CHALLENGE_STATUS_CHANGED"
      : "CHALLENGE_UPDATED";

    await createAuditLog({
      userId: session.user.id,
      action: auditAction,
      entityType: "Challenge",
      entityId: id,
      oldValue: { status: challenge.status },
      newValue: { status: updated.status },
      ipAddress,
      userAgent,
    });

    return ok(updated);
  } catch (err) {
    console.error("[PATCH /api/challenges/[id]]", err);
    return serverError();
  }
}

/**
 * DELETE /api/challenges/[id]
 * Admin only — soft delete (ARCHIVED status).
 */
export async function DELETE(
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
    if (!isAdmin) return forbidden("Only admins can delete challenges");

    const challenge = await prisma.challenge.findUnique({ where: { id } });
    if (!challenge) return notFound("Challenge not found");

    await prisma.challenge.update({
      where: { id },
      data: { status: "ARCHIVED" },
    });

    const { ipAddress, userAgent } = getRequestMeta(req);
    await createAuditLog({
      userId: session.user.id,
      action: "CHALLENGE_DELETED",
      entityType: "Challenge",
      entityId: id,
      oldValue: { status: challenge.status },
      newValue: { status: "ARCHIVED" },
      ipAddress,
      userAgent,
    });

    return ok({ message: "Challenge archived successfully" });
  } catch (err) {
    console.error("[DELETE /api/challenges/[id]]", err);
    return serverError();
  }
}
