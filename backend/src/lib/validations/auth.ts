import { z } from "zod";

export const RegisterSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z
    .string()
    .min(8, "Password must be at least 8 characters")
    .regex(/[A-Z]/, "Must contain an uppercase letter")
    .regex(/[0-9]/, "Must contain a number"),
  name: z.string().min(2, "Name must be at least 2 characters").max(100),
  role: z.enum([
    "SUPER_ADMIN",
    "CII_ADMIN",
    "INSTITUTION_SPOC",
    "INDUSTRY_SPOC",
    "STUDENT",
  ]),
  // Student-specific
  enrollmentNo: z.string().optional(),
  institutionId: z.string().optional(),
  department: z.string().optional(),
  yearOfStudy: z.number().min(1).max(6).optional(),
  skills: z.array(z.string()).optional(),
  // Industry-specific
  companyName: z.string().optional(),
  industry: z.string().optional(),
  websiteUrl: z.string().url().optional().or(z.literal("")),
  isCIIMember: z.boolean().optional(),
  // Institution SPOC-specific
  spocInstitutionId: z.string().optional(),
  designation: z.string().optional(),
});

export const LoginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(1, "Password is required"),
});
