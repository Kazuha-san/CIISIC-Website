import { NextRequest } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { createAuditLog, getRequestMeta } from "@/lib/audit";
import { serializeChallenge } from "@/lib/serializers";
import {
  ok,
  badRequest,
  forbidden,
  notFound,
  unauthorized,
  serverError,
} from "@/lib/api-response";
import { z } from "zod";

const ReviewSchema = z.object({
  action: z.enum(["APPROVE", "REJECT"]),
  remarks: z.string().max(1000).optional(),
});

/**
 * GET /api/admin/challenges/[id]/review
 * Return review details: reviewRemarks, reviewedAt, reviewerId, and reviewer info.
 */
export async function GET(
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

    const challenge = await prisma.challenge.findUnique({
      where: { id },
      include: {
        industryProfile: true,
        reviewer: {
          select: { id: true, name: true, email: true },
        },
      },
    });

    if (!challenge) {
      return notFound("Challenge not found");
    }

    const isOwner =
      session.user.role === "INDUSTRY_SPOC" &&
      challenge.industryProfile.userId === session.user.id;

    if (!isAdmin && !isOwner) {
      return forbidden("You do not have permission to view review details");
    }

    return ok({
      reviewRemarks: challenge.reviewRemarks,
      reviewedAt: challenge.reviewedAt,
      reviewerId: challenge.reviewerId,
      reviewer: challenge.reviewer,
      status: challenge.status,
    });
  } catch (err) {
    console.error("[GET /api/admin/challenges/[id]/review]", err);
    return serverError();
  }
}

/**
 * POST /api/admin/challenges/[id]/review
 * Admin review endpoint to approve or reject a challenge submission.
 */
export async function POST(
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
    if (!isAdmin) {
      return forbidden("Only administrators can review challenges");
    }

    const body = await req.json();
    const parsed = ReviewSchema.safeParse(body);
    if (!parsed.success) {
      return badRequest("Invalid review action request");
    }

    const { action, remarks } = parsed.data;

    const challenge = await prisma.challenge.findUnique({
      where: { id },
      include: {
        industryProfile: {
          select: { userId: true, companyName: true },
        },
      },
    });

    if (!challenge) {
      return notFound("Challenge not found");
    }

    const nextStatus = action === "APPROVE" ? "OPEN" : "REJECTED";

    const updatedChallenge = await prisma.challenge.update({
      where: { id },
      data: {
        status: nextStatus,
        reviewedAt: new Date(),
        reviewerId: session.user.id,
        reviewRemarks: remarks || null,
        ...(action === "APPROVE" && { publishedAt: new Date() }),
      },
      include: {
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
      },
    });

    // Notify the Industry SPOC (owner)
    await prisma.notification.create({
      data: {
        userId: challenge.industryProfile.userId,
        title: `Challenge ${action === "APPROVE" ? "Approved" : "Rejected"}`,
        body: remarks
          ? `Review Remarks: ${remarks}`
          : `Your challenge "${challenge.title}" has been ${action === "APPROVE" ? "approved" : "rejected"}.`,
        link: `/api/challenges/${id}`,
      },
    });

    // Create Audit Log entry
    const { ipAddress, userAgent } = getRequestMeta(req);
    const auditAction = action === "APPROVE" ? "CHALLENGE_APPROVED" : "CHALLENGE_REJECTED";
    await createAuditLog({
      userId: session.user.id,
      action: auditAction,
      entityType: "Challenge",
      entityId: id,
      oldValue: { status: challenge.status },
      newValue: {
        status: nextStatus,
        reviewRemarks: remarks,
        reviewedAt: updatedChallenge.reviewedAt,
        reviewerId: session.user.id,
      },
      ipAddress,
      userAgent,
    });

    return ok(serializeChallenge(updatedChallenge, session.user.role, session.user.id));
  } catch (err) {
    console.error("[POST /api/admin/challenges/[id]/review]", err);
    return serverError();
  }
}
