import { z } from "zod";
import { ProposalStatus } from "@prisma/client";

export const ProposalCreateSchema = z.object({
  summary: z
    .string()
    .min(20, "Summary must be at least 20 characters")
    .max(500, "Summary must be 500 characters or fewer"),
  approachDoc: z.string().optional(), // file URL/key — populated after upload
  isDraft: z.boolean().default(false),
});

export const ProposalStatusUpdateSchema = z.object({
  status: z.enum([
    "UNDER_REVIEW",
    "REVISION_REQUESTED",
    "APPROVED",
    "REJECTED",
  ]),
  revisionNotes: z.string().optional(),
  feedbackByIndustry: z.string().optional(),
});

export const ProposalQuerySchema = z.object({
  page: z.coerce.number().min(1).default(1),
  limit: z.coerce.number().min(1).max(50).default(20),
  status: z
    .enum([
      "DRAFT",
      "SUBMITTED",
      "UNDER_REVIEW",
      "REVISION_REQUESTED",
      "RESUBMITTED",
      "APPROVED",
      "REJECTED",
    ])
    .optional(),
});

export function validateProposalStatusTransition(
  oldStatus: ProposalStatus,
  newStatus: ProposalStatus
): boolean {
  if (oldStatus === newStatus) return true;

  switch (oldStatus) {
    case "DRAFT":
      return newStatus === "SUBMITTED";
    case "SUBMITTED":
      return (
        newStatus === "UNDER_REVIEW" ||
        newStatus === "APPROVED" ||
        newStatus === "REJECTED" ||
        newStatus === "REVISION_REQUESTED"
      );
    case "UNDER_REVIEW":
      return (
        newStatus === "APPROVED" ||
        newStatus === "REJECTED" ||
        newStatus === "REVISION_REQUESTED"
      );
    case "REVISION_REQUESTED":
      return newStatus === "RESUBMITTED";
    case "RESUBMITTED":
      return (
        newStatus === "UNDER_REVIEW" ||
        newStatus === "APPROVED" ||
        newStatus === "REJECTED"
      );
    case "APPROVED":
    case "REJECTED":
      // Terminal states — cannot transition
      return false;
    default:
      return false;
  }
}
