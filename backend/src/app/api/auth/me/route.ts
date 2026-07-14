import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { ok, unauthorized } from "@/lib/api-response";

/**
 * GET /api/auth/me
 * Returns the current authenticated user with their role-specific profile.
 */
export async function GET() {
  const session = await auth();
  if (!session?.user?.id) {
    return unauthorized();
  }

  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    include: {
      studentProfile: {
        include: { institution: true },
      },
      industryProfile: true,
      institutionProfile: {
        include: { institution: true },
      },
    },
  });

  if (!user) {
    return unauthorized("User no longer exists");
  }

  // Omit passwordHash
  const { passwordHash: _, ...safeUser } = user;

  return ok(safeUser);
}
