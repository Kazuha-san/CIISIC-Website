import { z } from "zod";

export const MessageCreateSchema = z.object({
  body: z
    .string()
    .min(1, "Message body cannot be empty")
    .max(5000, "Message too long"),
  type: z.enum(["QUERY", "RESPONSE"]).default("QUERY"),
  attachmentUrl: z.string().url().optional().or(z.literal("")),
});

// Contact info redaction patterns (phone, email embedded in message body)
const CONTACT_PATTERNS = [
  /\b[\w.+-]+@[\w-]+\.[a-zA-Z]{2,}\b/g, // email
  /(\+?91[-.\s]?)?[6-9]\d{9}/g, // Indian mobile numbers
  /\b\d{10,12}\b/g, // generic long digit sequences
  /https?:\/\/[^\s]+/g, // external URLs
];

export function redactContactInfo(text: string): string {
  let redacted = text;
  for (const pattern of CONTACT_PATTERNS) {
    redacted = redacted.replace(pattern, "[REDACTED]");
  }
  return redacted;
}
