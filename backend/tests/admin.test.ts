import { vi, describe, it, expect, beforeEach } from "vitest";
import { POST as reviewChallenge, GET as getReviewDetails } from "../src/app/api/admin/challenges/[id]/review/route";
import { NextRequest } from "next/server";
import { prisma } from "../src/lib/prisma";
import { auth } from "../src/lib/auth";

// Mock next-auth
vi.mock("../src/lib/auth", () => ({
  auth: vi.fn(),
}));

// Mock Prisma client
vi.mock("../src/lib/prisma", () => ({
  prisma: {
    challenge: {
      findUnique: vi.fn(),
      update: vi.fn(),
    },
    notification: {
      create: vi.fn().mockResolvedValue({}),
    },
    auditLog: {
      create: vi.fn().mockResolvedValue({}),
    },
  },
}));

describe("Admin Challenge Review Workflow", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("should block a student from reviewing a challenge", async () => {
    vi.mocked(auth).mockResolvedValue({
      user: { id: "student-1", role: "STUDENT", email: "student@jlu.edu.in", name: "Student" },
      expires: "",
    });

    const req = new NextRequest("http://localhost:3000/api/admin/challenges/challenge-1/review", {
      method: "POST",
      body: JSON.stringify({ action: "APPROVE", remarks: "Great project" }),
    });

    const res = await reviewChallenge(req, { params: Promise.resolve({ id: "challenge-1" }) });
    expect(res.status).toBe(403);
    const json = await res.json();
    expect(json.success).toBe(false);
    expect(json.message).toBe("Only administrators can review challenges");
  });

  it("should allow admin to approve a challenge and change status to OPEN", async () => {
    vi.mocked(auth).mockResolvedValue({
      user: { id: "admin-1", role: "CII_ADMIN", email: "admin@cii.org", name: "Admin" },
      expires: "",
    });

    vi.mocked(prisma.challenge.findUnique).mockResolvedValue({
      id: "challenge-1",
      title: "Pending Challenge",
      status: "UNDER_REVIEW",
      industryProfile: {
        userId: "industry-user-1",
      },
    } as any);

    vi.mocked(prisma.challenge.update).mockResolvedValue({
      id: "challenge-1",
      title: "Pending Challenge",
      status: "OPEN",
      publishedAt: new Date(),
      reviewedAt: new Date(),
      reviewerId: "admin-1",
      reviewRemarks: "Approved",
      industryProfile: {
        userId: "industry-user-1",
        companyName: "TechCorp",
      },
    } as any);

    const req = new NextRequest("http://localhost:3000/api/admin/challenges/challenge-1/review", {
      method: "POST",
      body: JSON.stringify({ action: "APPROVE", remarks: "Approved" }),
    });

    const res = await reviewChallenge(req, { params: Promise.resolve({ id: "challenge-1" }) });
    expect(res.status).toBe(200);

    const json = await res.json();
    expect(json.success).toBe(true);
    expect(json.data.status).toBe("OPEN");

    expect(prisma.challenge.update).toHaveBeenCalledWith({
      where: { id: "challenge-1" },
      data: expect.objectContaining({
        status: "OPEN",
        reviewerId: "admin-1",
        reviewRemarks: "Approved",
      }),
      include: expect.any(Object),
    });

    expect(prisma.notification.create).toHaveBeenCalled();
    expect(prisma.auditLog.create).toHaveBeenCalled();
  });

  it("should allow admin to reject a challenge and change status to REJECTED", async () => {
    vi.mocked(auth).mockResolvedValue({
      user: { id: "admin-1", role: "CII_ADMIN", email: "admin@cii.org", name: "Admin" },
      expires: "",
    });

    vi.mocked(prisma.challenge.findUnique).mockResolvedValue({
      id: "challenge-1",
      title: "Pending Challenge",
      status: "UNDER_REVIEW",
      industryProfile: {
        userId: "industry-user-1",
      },
    } as any);

    vi.mocked(prisma.challenge.update).mockResolvedValue({
      id: "challenge-1",
      title: "Pending Challenge",
      status: "REJECTED",
      reviewedAt: new Date(),
      reviewerId: "admin-1",
      reviewRemarks: "Rejected, needs more detail",
      industryProfile: {
        userId: "industry-user-1",
        companyName: "TechCorp",
      },
    } as any);

    const req = new NextRequest("http://localhost:3000/api/admin/challenges/challenge-1/review", {
      method: "POST",
      body: JSON.stringify({ action: "REJECT", remarks: "Rejected, needs more detail" }),
    });

    const res = await reviewChallenge(req, { params: Promise.resolve({ id: "challenge-1" }) });
    expect(res.status).toBe(200);

    const json = await res.json();
    expect(json.success).toBe(true);
    expect(json.data.status).toBe("REJECTED");

    expect(prisma.challenge.update).toHaveBeenCalledWith({
      where: { id: "challenge-1" },
      data: expect.objectContaining({
        status: "REJECTED",
        reviewerId: "admin-1",
        reviewRemarks: "Rejected, needs more detail",
      }),
      include: expect.any(Object),
    });
  });

  it("should return review details to admin or owner", async () => {
    vi.mocked(auth).mockResolvedValue({
      user: { id: "admin-1", role: "CII_ADMIN", email: "admin@cii.org", name: "Admin" },
      expires: "",
    });

    vi.mocked(prisma.challenge.findUnique).mockResolvedValue({
      id: "challenge-1",
      status: "REJECTED",
      reviewRemarks: "Rejected, needs more detail",
      reviewedAt: new Date(),
      reviewerId: "admin-1",
      industryProfile: {
        userId: "industry-user-1",
      },
      reviewer: {
        id: "admin-1",
        name: "Admin User",
        email: "admin@cii.org",
      },
    } as any);

    const req = new NextRequest("http://localhost:3000/api/admin/challenges/challenge-1/review");
    const res = await getReviewDetails(req, { params: Promise.resolve({ id: "challenge-1" }) });
    expect(res.status).toBe(200);

    const json = await res.json();
    expect(json.success).toBe(true);
    expect(json.data.reviewRemarks).toBe("Rejected, needs more detail");
    expect(json.data.status).toBe("REJECTED");
  });
});

