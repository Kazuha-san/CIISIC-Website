import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

/**
 * GET /api/cron/deadline-notifications
 * System cron trigger to find challenges with deadlines approaching in < 48 hours
 * and notify relevant users (Industry SPOC owner and participating students).
 */
export async function GET(req: NextRequest) {
  try {
    const now = new Date();
    const threshold = new Date(now.getTime() + 48 * 60 * 60 * 1000); // 48 hours from now

    // Find all open challenges ending soon
    const challenges = await prisma.challenge.findMany({
      where: {
        status: "OPEN",
        deadline: {
          gt: now,
          lte: threshold,
        },
      },
      include: {
        industryProfile: true,
        proposals: {
          include: {
            studentProfile: true,
          },
        },
      },
    });

    let notificationsCreated = 0;

    for (const challenge of challenges) {
      const challengeLink = `/api/challenges/${challenge.id}`;

      // Check if we already sent a deadline warning notification for this challenge
      const existingNotification = await prisma.notification.findFirst({
        where: {
          link: challengeLink,
          title: {
            contains: "Deadline Approaching",
          },
        },
      });

      if (existingNotification) {
        continue;
      }

      const deadlineStr = challenge.deadline.toLocaleDateString("en-IN", {
        timeZone: "Asia/Kolkata",
        dateStyle: "medium",
      });

      // 1. Notify Industry SPOC
      await prisma.notification.create({
        data: {
          userId: challenge.industryProfile.userId,
          title: "Challenge Deadline Approaching",
          body: `The deadline for your project "${challenge.title}" is approaching on ${deadlineStr}.`,
          link: challengeLink,
        },
      });
      notificationsCreated++;

      // 2. Notify all students who submitted/drafted proposals for this challenge
      for (const proposal of challenge.proposals) {
        await prisma.notification.create({
          data: {
            userId: proposal.studentProfile.userId,
            title: "Challenge Deadline Approaching",
            body: `The deadline for the project "${challenge.title}" you applied to is approaching on ${deadlineStr}.`,
            link: challengeLink,
          },
        });
        notificationsCreated++;
      }
    }

    return NextResponse.json({
      success: true,
      message: `Processed ${challenges.length} challenges. Sent ${notificationsCreated} notifications.`,
    });
  } catch (err) {
    console.error("[GET /api/cron/deadline-notifications] Error:", err);
    return NextResponse.json(
      { success: false, message: "Internal server error" },
      { status: 500 }
    );
  }
}
