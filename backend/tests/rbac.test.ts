import { vi, describe, it, expect, beforeEach } from "vitest";
import { GET as getChallenge } from "../src/app/api/challenges/[id]/route";
import { GET as getProposals } from "../src/app/api/challenges/[id]/proposals/route";
import { GET as getProposalDetail } from "../src/app/api/proposals/[id]/route";
import { serializeChallenge, serializeProposal } from "../src/lib/serializers";
import { validateProposalStatusTransition } from "../src/lib/validations/proposal";
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
      update: vi.fn().mockReturnValue({ catch: vi.fn() }),
    },
    proposal: {
      findUnique: vi.fn(),
      findMany: vi.fn(),
      count: vi.fn(),
    },
    institutionProfile: {
      findUnique: vi.fn(),
    },
    industryProfile: {
      findUnique: vi.fn(),
    },
    auditLog: {
      create: vi.fn(),
    },
    notification: {
      create: vi.fn(),
    },
  },
}));

describe("RBAC & Object-Level Access Control", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe("Challenge Status & Visibility", () => {
    it("should allow a guest to view an OPEN challenge", async () => {
      // Mock unauthenticated session
      vi.mocked(auth as any).mockResolvedValue(null);

      // Mock open challenge in DB
      vi.mocked(prisma.challenge.findUnique).mockResolvedValue({
        id: "challenge-1",
        title: "Open Challenge",
        status: "OPEN",
        description: "Open challenge description",
        problemStatement: "Problem",
        domain: "AI_IN_BUSINESS",
        deadline: new Date(),
        budgetRange: "₹50k",
        tags: [],
        viewCount: 10,
        publishedAt: new Date(),
        createdAt: new Date(),
        updatedAt: new Date(),
        industryProfileId: "ind-1",
        industryProfile: {
          userId: "industry-user-1",
          companyName: "TechCorp",
          industry: "Tech",
          logoUrl: null,
          isCIIMember: true,
        },
      } as any);

      const req = new NextRequest("http://localhost:3000/api/challenges/challenge-1");
      const res = await getChallenge(req, { params: Promise.resolve({ id: "challenge-1" }) });

      expect(res.status).toBe(200);
      const json = await res.json();
      expect(json.success).toBe(true);
      expect(json.data.title).toBe("Open Challenge");
    });

    it("should block a student from viewing a DRAFT challenge", async () => {
      vi.mocked(auth as any).mockResolvedValue({
        user: { id: "student-1", role: "STUDENT", email: "student@jlu.edu.in", name: "Student" },
        expires: "",
      });

      vi.mocked(prisma.challenge.findUnique).mockResolvedValue({
        id: "challenge-2",
        title: "Draft Challenge",
        status: "DRAFT",
        industryProfile: { userId: "industry-user-1" },
      } as any);

      const req = new NextRequest("http://localhost:3000/api/challenges/challenge-2");
      const res = await getChallenge(req, { params: Promise.resolve({ id: "challenge-2" }) });

      expect(res.status).toBe(404); // Returns 404 for security / obfuscation
    });

    it("should allow the creator Industry SPOC to view their own DRAFT challenge", async () => {
      vi.mocked(auth as any).mockResolvedValue({
        user: { id: "industry-user-1", role: "INDUSTRY_SPOC", email: "hr@techcorp.com", name: "Industry" },
        expires: "",
      });

      vi.mocked(prisma.challenge.findUnique).mockResolvedValue({
        id: "challenge-2",
        title: "Draft Challenge",
        status: "DRAFT",
        industryProfile: { userId: "industry-user-1" },
      } as any);

      const req = new NextRequest("http://localhost:3000/api/challenges/challenge-2");
      const res = await getChallenge(req, { params: Promise.resolve({ id: "challenge-2" }) });

      expect(res.status).toBe(200);
    });
  });

  describe("Proposal Authorization & Filtering", () => {
    it("should block an unauthorized user from viewing a proposal details", async () => {
      vi.mocked(auth as any).mockResolvedValue({
        user: { id: "student-2", role: "STUDENT", email: "stud2@jlu.edu.in", name: "Student 2" },
        expires: "",
      });

      vi.mocked(prisma.proposal.findUnique).mockResolvedValue({
        id: "prop-1",
        studentProfile: { userId: "student-1", institutionId: "inst-1" },
        challenge: { industryProfile: { userId: "industry-user-1" } },
      } as any);

      const req = new NextRequest("http://localhost:3000/api/proposals/prop-1");
      const res = await getProposalDetail(req, { params: Promise.resolve({ id: "prop-1" }) });

      expect(res.status).toBe(403);
    });

    it("should allow student owner to view their own proposal details", async () => {
      vi.mocked(auth as any).mockResolvedValue({
        user: { id: "student-1", role: "STUDENT", email: "stud1@jlu.edu.in", name: "Student 1" },
        expires: "",
      });

      vi.mocked(prisma.proposal.findUnique).mockResolvedValue({
        id: "prop-1",
        studentProfile: { userId: "student-1", institutionId: "inst-1" },
        challenge: { industryProfile: { userId: "industry-user-1" } },
      } as any);

      const req = new NextRequest("http://localhost:3000/api/proposals/prop-1");
      const res = await getProposalDetail(req, { params: Promise.resolve({ id: "prop-1" }) });

      expect(res.status).toBe(200);
    });

    it("should allow institution SPOC to view proposal details of their own institution student", async () => {
      vi.mocked(auth as any).mockResolvedValue({
        user: { id: "spoc-user-1", role: "INSTITUTION_SPOC", email: "spoc@jlu.edu.in", name: "SPOC" },
        expires: "",
      });

      vi.mocked(prisma.institutionProfile.findUnique).mockResolvedValue({
        institutionId: "inst-1",
      } as any);

      vi.mocked(prisma.proposal.findUnique).mockResolvedValue({
        id: "prop-1",
        studentProfile: { userId: "student-1", institutionId: "inst-1" },
        challenge: { industryProfile: { userId: "industry-user-1" } },
      } as any);

      const req = new NextRequest("http://localhost:3000/api/proposals/prop-1");
      const res = await getProposalDetail(req, { params: Promise.resolve({ id: "prop-1" }) });

      expect(res.status).toBe(200);
    });

    it("should block institution SPOC from viewing proposals of students from other institutions", async () => {
      vi.mocked(auth as any).mockResolvedValue({
        user: { id: "spoc-user-1", role: "INSTITUTION_SPOC", email: "spoc@jlu.edu.in", name: "SPOC" },
        expires: "",
      });

      vi.mocked(prisma.institutionProfile.findUnique).mockResolvedValue({
        institutionId: "inst-2", // different institution
      } as any);

      vi.mocked(prisma.proposal.findUnique).mockResolvedValue({
        id: "prop-1",
        studentProfile: { userId: "student-1", institutionId: "inst-1" },
        challenge: { industryProfile: { userId: "industry-user-1" } },
      } as any);

      const req = new NextRequest("http://localhost:3000/api/proposals/prop-1");
      const res = await getProposalDetail(req, { params: Promise.resolve({ id: "prop-1" }) });

      expect(res.status).toBe(403);
    });
  });
});

describe("Data Privacy & Serializers", () => {
  it("should strip challenge budget range from students", () => {
    const rawChallenge = {
      id: "ch-1",
      title: "Test Challenge",
      budgetRange: "₹1,00,000",
      industryProfile: {
        userId: "ind-1",
        companyName: "TechCorp",
        industry: "IT",
      },
    };

    const studentSerialized = serializeChallenge(rawChallenge, "STUDENT", "student-1");
    expect(studentSerialized.budgetRange).toBeUndefined();

    const adminSerialized = serializeChallenge(rawChallenge, "CII_ADMIN", "admin-1");
    expect(adminSerialized.budgetRange).toBe("₹1,00,000");
  });

  it("should strip student PII from industry SPOC", () => {
    const rawProposal = {
      id: "prop-1",
      status: "SUBMITTED",
      summary: "Approach summary",
      studentProfile: {
        userId: "student-1",
        enrollmentNo: "JLU2024CS001",
        department: "CS",
        yearOfStudy: 3,
        skills: ["React"],
        user: {
          name: "Arjun Verma",
          email: "arjun@jlu.edu.in",
        },
      },
    };

    // Serialize for industry SPOC
    const industrySerialized = serializeProposal(rawProposal, "INDUSTRY_SPOC", "industry-1");
    expect(industrySerialized.student?.name).toBeUndefined();
    expect(industrySerialized.student?.email).toBeUndefined();
    expect(industrySerialized.student?.enrollmentNo).toBeUndefined();
    expect(industrySerialized.student?.department).toBe("CS");

    // Serialize for admin
    const adminSerialized = serializeProposal(rawProposal, "CII_ADMIN", "admin-1");
    expect(adminSerialized.student?.name).toBe("Arjun Verma");
    expect(adminSerialized.student?.email).toBe("arjun@jlu.edu.in");
    expect(adminSerialized.student?.enrollmentNo).toBe("JLU2024CS001");
  });
});

describe("Proposal Workflow State Transitions", () => {
  it("should validate legal state flow transitions", () => {
    expect(validateProposalStatusTransition("DRAFT", "SUBMITTED")).toBe(true);
    expect(validateProposalStatusTransition("SUBMITTED", "UNDER_REVIEW")).toBe(true);
    expect(validateProposalStatusTransition("UNDER_REVIEW", "REVISION_REQUESTED")).toBe(true);
    expect(validateProposalStatusTransition("REVISION_REQUESTED", "RESUBMITTED")).toBe(true);
    expect(validateProposalStatusTransition("RESUBMITTED", "APPROVED")).toBe(true);
  });

  it("should reject illegal transitions", () => {
    expect(validateProposalStatusTransition("APPROVED", "DRAFT")).toBe(false);
    expect(validateProposalStatusTransition("REJECTED", "SUBMITTED")).toBe(false);
    expect(validateProposalStatusTransition("DRAFT", "APPROVED")).toBe(false);
  });
});
