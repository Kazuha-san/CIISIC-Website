import { NextRequest } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import {
  MessageCreateSchema,
  redactContactInfo,
} from "@/lib/validations/message";
import { createAuditLog, getRequestMeta } from "@/lib/audit";
import {
  ok,
  created,
  forbidden,
  notFound,
  unauthorized,
  serverError,
  validationError,
} from "@/lib/api-response";

/**
 * GET /api/proposals/[id]/messages
 * Returns the message thread for a proposal.
 * Accessible by: proposal student, challenge industry SPOC, admins.
 */
export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const session = await auth();
    if (!session?.user?.id) return unauthorized();

    const proposal = await prisma.proposal.findUnique({
      where: { id },
      include: {
        studentProfile: { select: { userId: true } },
        challenge: {
          include: { industryProfile: { select: { userId: true } } },
        },
      },
    });
    if (!proposal) return notFound("Proposal not found");

    const role = session.user.role;
    const userId = session.user.id;
    const isAdmin = role === "SUPER_ADMIN" || role === "CII_ADMIN";
    const isStudent = proposal.studentProfile.userId === userId;
    const isIndustry =
      role === "INDUSTRY_SPOC" &&
      proposal.challenge.industryProfile.userId === userId;

    if (!isAdmin && !isStudent && !isIndustry) {
      return forbidden("Access denied to this message thread");
    }

    const { searchParams } = new URL(req.url);
    const page = Math.max(1, parseInt(searchParams.get("page") ?? "1"));
    const limit = Math.min(100, parseInt(searchParams.get("limit") ?? "50"));
    const skip = (page - 1) * limit;

    const [total, messages] = await Promise.all([
      prisma.message.count({ where: { proposalId: id } }),
      prisma.message.findMany({
        where: { proposalId: id },
        skip,
        take: limit,
        orderBy: { createdAt: "asc" },
        include: {
          sender: {
            select: {
              id: true,
              name: true,
              role: true,
              avatarUrl: true,
            },
          },
        },
      }),
    ]);

    return ok({
      data: messages,
      pagination: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    });
  } catch (err) {
    console.error("[GET /api/proposals/[id]/messages]", err);
    return serverError();
  }
}

/**
 * POST /api/proposals/[id]/messages
 * Send a message on a proposal thread.
 * Only student (QUERY) and industry SPOC (RESPONSE) can send.
 * Contact info is automatically redacted.
 */
export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const session = await auth();
    if (!session?.user?.id) return unauthorized();

    const role = session.user.role;
    const userId = session.user.id;

    if (role !== "STUDENT" && role !== "INDUSTRY_SPOC") {
      return forbidden("Only students and industry SPOCs can send messages");
    }

    const proposal = await prisma.proposal.findUnique({
      where: { id },
      include: {
        studentProfile: { select: { userId: true } },
        challenge: {
          include: { industryProfile: { select: { userId: true } } },
        },
      },
    });
    if (!proposal) return notFound("Proposal not found");

    const isStudent = proposal.studentProfile.userId === userId;
    const isIndustry =
      role === "INDUSTRY_SPOC" &&
      proposal.challenge.industryProfile.userId === userId;

    if (!isStudent && !isIndustry) {
      return forbidden("You are not a participant in this proposal thread");
    }

    const body = await req.json();
    const parsed = MessageCreateSchema.safeParse(body);
    if (!parsed.success) return validationError(parsed.error.flatten());

    // Auto-redact any contact info to prevent leaking identities
    const redactedBody = redactContactInfo(parsed.data.body);

    const message = await prisma.message.create({
      data: {
        proposalId: id,
        senderId: userId,
        body: redactedBody,
        type: isIndustry ? "RESPONSE" : "QUERY",
        attachmentUrl: parsed.data.attachmentUrl || null,
      },
      include: {
        sender: { select: { id: true, name: true, role: true, avatarUrl: true } },
      },
    });

    // Notify the other party
    const recipientId = isStudent
      ? proposal.challenge.industryProfile.userId
      : proposal.studentProfile.userId;

    await prisma.notification.create({
      data: {
        userId: recipientId,
        title: "New Message",
        body: `${session.user.name} sent a message on a proposal`,
        link: `/api/proposals/${id}/messages`,
      },
    });

    const { ipAddress, userAgent } = getRequestMeta(req);
    await createAuditLog({
      userId,
      action: "MESSAGE_SENT",
      entityType: "Message",
      entityId: message.id,
      newValue: { proposalId: id, type: message.type },
      ipAddress,
      userAgent,
    });

    return created(message);
  } catch (err) {
    console.error("[POST /api/proposals/[id]/messages]", err);
    return serverError();
  }
}
