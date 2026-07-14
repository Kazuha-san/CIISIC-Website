import { z } from "zod";

export const InstitutionCreateSchema = z.object({
  name: z.string().min(3).max(200),
  city: z.string().min(2).max(100),
  state: z.string().default("Madhya Pradesh"),
  logoUrl: z.string().url().optional().or(z.literal("")),
  websiteUrl: z.string().url().optional().or(z.literal("")),
  cellTheme: z
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
  spocUserId: z.string().optional(),
});

export const InstitutionUpdateSchema = InstitutionCreateSchema.partial();
