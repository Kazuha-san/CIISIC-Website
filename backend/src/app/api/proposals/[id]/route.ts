import { NextRequest } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import {
  ProposalStatusUpdateSchema,
  validateProposalStatusTransition,
} from "@/lib/validations/proposal";
import { createAuditLog, getRequestMeta } from "@/lib/audit";
import { serializeProposal } from "@/lib/serializers";
import {
  ok,
  forbidden,
  notFound,
  unauthorized,
  serverError,
  validationError,
  badRequest,
} from "@/lib/api-response";
import { sendProposalStatusEmail } from "@/lib/email";

const PROPOSAL_INCLUDE = {
  studentProfile: {
    select: {
      userId: true,
      enrollmentNo: true,
      department: true,
      yearOfStudy: true,
      skills: true,
      institutionId: true,
      institution: { select: { name: true, city: true } },
      user: { select: { name: true, email: true } },
    },
  },
  challenge: {
    select: {
      title: true,
      domain: true,
      industryProfileId: true,
      industryProfile: { select: { userId: true } },
    },
  },
} as const;

/**
 * GET /api/proposals/[id]
 * Student: own proposal | Industry: their challenge's proposal | Institution SPOC: their student's proposal | Admin: all
 */
export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const session = await auth();
    if (!session?.user?.id) return unauthorized();

    const proposal = await prisma.proposal.findUnique({
      where: { id },
      include: PROPOSAL_INCLUDE,
    });
    if (!proposal) return notFound("Proposal not found");

    const role = session.user.role;
    const userId = session.user.id;
    const isAdmin = role === "SUPER_ADMIN" || role === "CII_ADMIN";
    const isOwner = proposal.studentProfile.userId === userId;
    const isIndustryOwner =
      role === "INDUSTRY_SPOC" &&
      proposal.challenge.industryProfile.userId === userId;

    let requestingUserInstitutionId: string | undefined;
    let isInstitutionSpocOwner = false;
    if (role === "INSTITUTION_SPOC") {
      const spocProfile = await prisma.institutionProfile.findUnique({
        where: { userId },
        select: { institutionId: true },
      });
      if (spocProfile) {
        requestingUserInstitutionId = spocProfile.institutionId;
        if (
          requestingUserInstitutionId === proposal.studentProfile.institutionId
        ) {
          isInstitutionSpocOwner = true;
        }
      }
    }

    if (!isAdmin && !isOwner && !isIndustryOwner && !isInstitutionSpocOwner) {
      return forbidden("Access denied");
    }

    return ok(serializeProposal(proposal, role, userId, requestingUserInstitutionId));
  } catch (err) {
    console.error("[GET /api/proposals/[id]]", err);
    return serverError();
  }
}

/**
 * PATCH /api/proposals/[id]
 * Industry SPOC (own challenge) or Admin — update status, add revision notes / feedback.
 */
export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const session = await auth();
    if (!session?.user?.id) return unauthorized();

    const role = session.user.role;
    const isAdmin = role === "SUPER_ADMIN" || role === "CII_ADMIN";
    const isIndustry = role === "INDUSTRY_SPOC";

    if (!isAdmin && !isIndustry) {
      return forbidden("Only industry SPOCs and admins can update proposal status");
    }

    const proposal = await prisma.proposal.findUnique({
      where: { id },
      include: {
        challenge: {
          select: {
            title: true,
            industryProfileId: true,
            industryProfile: { select: { userId: true } },
          },
        },
        studentProfile: {
          select: {
            userId: true,
            user: { select: { name: true, email: true } },
          },
        },
      },
    });
    if (!proposal) return notFound("Proposal not found");

    if (isIndustry && proposal.challenge.industryProfile.userId !== session.user.id) {
      return forbidden("This proposal is not for your challenge");
    }

    const body = await req.json();
    const parsed = ProposalStatusUpdateSchema.safeParse(body);
    if (!parsed.success) return validationError(parsed.error.flatten());

    const { status, revisionNotes, feedbackByIndustry } = parsed.data;
    const oldStatus = proposal.status;

    if (!validateProposalStatusTransition(oldStatus, status)) {
      return badRequest(`Invalid status transition from ${oldStatus} to ${status}`);
    }

    const updated = await prisma.proposal.update({
      where: { id },
      data: {
        status,
        ...(revisionNotes !== undefined && { revisionNotes }),
        ...(feedbackByIndustry !== undefined && { feedbackByIndustry }),
      },
    });

    // Notify the student
    await prisma.notification.create({
      data: {
        userId: proposal.studentProfile.userId,
        title: `Proposal ${status.replace(/_/g, " ").toLowerCase()}`,
        body: revisionNotes
          ? `Revision requested: ${revisionNotes.slice(0, 100)}`
          : `Your proposal status has been updated to: ${status}`,
        link: `/api/proposals/${id}`,
      },
    });

    if (proposal.studentProfile.user) {
      try {
        await sendProposalStatusEmail(
          proposal.studentProfile.user.email,
          proposal.studentProfile.user.name,
          status,
          proposal.challenge.title,
          revisionNotes
        );
      } catch (err) {
        console.error("[ProposalPATCH] Failed to send status email:", err);
      }
    }

    const { ipAddress, userAgent } = getRequestMeta(req);
    await createAuditLog({
      userId: session.user.id,
      action: "PROPOSAL_STATUS_CHANGED",
      entityType: "Proposal",
      entityId: id,
      oldValue: { status: oldStatus },
      newValue: { status, revisionNotes, feedbackByIndustry },
      ipAddress,
      userAgent,
    });

    return ok(updated);
  } catch (err) {
    console.error("[PATCH /api/proposals/[id]]", err);
    return serverError();
  }
}
