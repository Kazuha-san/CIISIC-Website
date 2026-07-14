import { NextRequest } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { ProposalQuerySchema } from "@/lib/validations/proposal";
import { serializeProposal } from "@/lib/serializers";
import {
  ok,
  unauthorized,
  serverError,
  validationError,
} from "@/lib/api-response";

/**
 * GET /api/proposals
 * Returns proposals scoped to the requesting user's role:
 * - Student: own proposals only
 * - Industry SPOC: proposals for their challenges
 * - Institution SPOC: proposals from their institution's students
 * - Admin: all proposals
 */
export async function GET(req: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user?.id) return unauthorized();

    const { searchParams } = new URL(req.url);
    const queryParsed = ProposalQuerySchema.safeParse({
      page: searchParams.get("page"),
      limit: searchParams.get("limit"),
      status: searchParams.get("status"),
    });
    if (!queryParsed.success) return validationError(queryParsed.error.flatten());
    const { page, limit, status } = queryParsed.data;

    const role = session.user.role;
    const userId = session.user.id;
    const skip = (page - 1) * limit;
    let requestingUserInstitutionId: string | undefined;

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    let where: any = status ? { status } : {};

    if (role === "STUDENT") {
      const profile = await prisma.studentProfile.findUnique({
        where: { userId },
        select: { id: true },
      });
      if (!profile) return ok({ data: [], pagination: { total: 0, page, limit, totalPages: 0 } });
      where.studentProfileId = profile.id;
    } else if (role === "INDUSTRY_SPOC") {
      const profile = await prisma.industryProfile.findUnique({
        where: { userId },
        select: { id: true },
      });
      if (!profile) return ok({ data: [], pagination: { total: 0, page, limit, totalPages: 0 } });
      where.challenge = { industryProfileId: profile.id };
    } else if (role === "INSTITUTION_SPOC") {
      const profile = await prisma.institutionProfile.findUnique({
        where: { userId },
        select: { institutionId: true },
      });
      if (!profile) return ok({ data: [], pagination: { total: 0, page, limit, totalPages: 0 } });
      where.studentProfile = { institutionId: profile.institutionId };
      requestingUserInstitutionId = profile.institutionId;
    }
    // SUPER_ADMIN and CII_ADMIN: no filter (see all)

    const [total, proposals] = await Promise.all([
      prisma.proposal.count({ where }),
      prisma.proposal.findMany({
        where,
        skip,
        take: limit,
        orderBy: { submittedAt: "desc" },
        include: {
          studentProfile: {
            select: {
              userId: true,
              department: true,
              yearOfStudy: true,
              skills: true,
              institutionId: true,
              user: { select: { name: true, email: true } },
            },
          },
          challenge: { select: { title: true, domain: true } },
        },
      }),
    ]);

    const serialized = proposals.map((p) =>
      serializeProposal(p, role, userId, requestingUserInstitutionId)
    );

    return ok({
      data: serialized,
      pagination: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    });
  } catch (err) {
    console.error("[GET /api/proposals]", err);
    return serverError();
  }
}
