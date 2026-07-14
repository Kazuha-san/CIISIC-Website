import { NextRequest } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import {
  ok,
  unauthorized,
  serverError,
} from "@/lib/api-response";

/**
 * GET /api/notifications
 * Returns notifications for the authenticated user.
 * Query: page, limit, unreadOnly
 */
export async function GET(req: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user?.id) return unauthorized();

    const { searchParams } = new URL(req.url);
    const page = Math.max(1, parseInt(searchParams.get("page") ?? "1"));
    const limit = Math.min(50, parseInt(searchParams.get("limit") ?? "20"));
    const unreadOnly = searchParams.get("unreadOnly") === "true";
    const skip = (page - 1) * limit;

    const where = {
      userId: session.user.id,
      ...(unreadOnly ? { isRead: false } : {}),
    };

    const [total, notifications, unreadCount] = await Promise.all([
      prisma.notification.count({ where }),
      prisma.notification.findMany({
        where,
        skip,
        take: limit,
        orderBy: { createdAt: "desc" },
      }),
      prisma.notification.count({
        where: { userId: session.user.id, isRead: false },
      }),
    ]);

    return ok({
      data: notifications,
      unreadCount,
      pagination: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    });
  } catch (err) {
    console.error("[GET /api/notifications]", err);
    return serverError();
  }
}

/**
 * PATCH /api/notifications
 * Mark notifications as read.
 * Body: { ids: string[] } OR { all: true } to mark all read.
 */
export async function PATCH(req: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user?.id) return unauthorized();

    const body = await req.json();
    const { ids, all } = body as { ids?: string[]; all?: boolean };

    if (all) {
      await prisma.notification.updateMany({
        where: { userId: session.user.id, isRead: false },
        data: { isRead: true },
      });
    } else if (ids && ids.length > 0) {
      await prisma.notification.updateMany({
        where: {
          id: { in: ids },
          userId: session.user.id, // Ensure ownership
        },
        data: { isRead: true },
      });
    }

    return ok({ message: "Notifications marked as read" });
  } catch (err) {
    console.error("[PATCH /api/notifications]", err);
    return serverError();
  }
}
