import { z } from "zod";

export const ChallengeCreateSchema = z.object({
  title: z.string().min(5, "Title must be at least 5 characters").max(200),
  description: z.string().min(20, "Description must be at least 20 characters"),
  problemStatement: z
    .string()
    .min(20, "Problem statement must be at least 20 characters"),
  domain: z.enum([
    "FAMILY_BUSINESS",
    "TALENT_READINESS",
    "RESEARCH_INNOVATION",
    "AI_IN_BUSINESS",
    "AGRITECH",
    "SKILL_DEVELOPMENT",
    "STARTUP",
  ]),
  deadline: z.string().datetime("Invalid deadline date").refine((val) => {
    return new Date(val) > new Date();
  }, {
    message: "Deadline must be a future date",
  }),
  budgetRange: z.string().optional(),
  tags: z.array(z.string()).max(10).optional(),
  attachmentUrls: z.array(z.string().url()).optional(),
  organizationName: z.string().min(2, "Organization name must be at least 2 characters").max(100).optional(),
  duration: z.string().min(1, "Duration is required").max(50).optional(),
  status: z.enum(["DRAFT", "PENDING_APPROVAL", "OPEN", "REJECTED", "UNDER_REVIEW", "CLOSED", "ARCHIVED"]).optional(),
});

export const ChallengeUpdateSchema = ChallengeCreateSchema.partial().extend({
  status: z
    .enum(["DRAFT", "PENDING_APPROVAL", "OPEN", "REJECTED", "UNDER_REVIEW", "CLOSED", "ARCHIVED"])
    .optional(),
});

export const ChallengeQuerySchema = z.object({
  page: z.coerce.number().min(1).default(1),
  limit: z.coerce.number().min(1).max(100).default(20),
  status: z
    .enum(["DRAFT", "PENDING_APPROVAL", "OPEN", "REJECTED", "UNDER_REVIEW", "CLOSED", "ARCHIVED"])
    .optional(),
  domain: z
    .enum([
      "FAMILY_BUSINESS",
      "TALENT_READINESS",
      "RESEARCH_INNOVATION",
      "AI_IN_BUSINESS",
      "AGRITECH",
      "SKILL_DEVELOPMENT",
      "STARTUP",
    ])
    .optional(),
  deadline: z.string().optional(),
  search: z.string().optional(),
  sortBy: z.enum(["createdAt", "deadline", "viewCount"]).default("createdAt"),
  sortOrder: z.enum(["asc", "desc"]).default("desc"),
});
