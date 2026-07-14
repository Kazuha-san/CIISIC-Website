import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";
import * as dotenv from "dotenv";

dotenv.config({ path: ".env.local" });

const prisma = new PrismaClient();



async function hash(password: string) {
  return bcrypt.hash(password, 12);
}

async function main() {
  console.log("🌱 Seeding database...");

  // ─── Institutions ─────────────────────────────────────────────────────────
  const institutions = await Promise.all([
    prisma.institution.upsert({
      where: { name: "Jagran Lakecity University, Bhopal" },
      update: {},
      create: {
        name: "Jagran Lakecity University, Bhopal",
        city: "Bhopal",
        state: "Madhya Pradesh",
        cellTheme: "FAMILY_BUSINESS",
        websiteUrl: "https://jlu.edu.in",
      },
    }),
    prisma.institution.upsert({
      where: { name: "Lakshmi Narain College of Technology, Bhopal" },
      update: {},
      create: {
        name: "Lakshmi Narain College of Technology, Bhopal",
        city: "Bhopal",
        state: "Madhya Pradesh",
        cellTheme: "TALENT_READINESS",
        websiteUrl: "https://lnct.ac.in",
      },
    }),
    prisma.institution.upsert({
      where: { name: "LNCT University, Bhopal" },
      update: {},
      create: {
        name: "LNCT University, Bhopal",
        city: "Bhopal",
        state: "Madhya Pradesh",
        cellTheme: "RESEARCH_INNOVATION",
        websiteUrl: "https://lnctu.ac.in",
      },
    }),
    prisma.institution.upsert({
      where: { name: "Oriental Group of Institutes, Bhopal" },
      update: {},
      create: {
        name: "Oriental Group of Institutes, Bhopal",
        city: "Bhopal",
        state: "Madhya Pradesh",
        cellTheme: "AI_IN_BUSINESS",
        websiteUrl: "https://oriental.ac.in",
      },
    }),
    prisma.institution.upsert({
      where: { name: "RNTU, Bhopal" },
      update: {},
      create: {
        name: "RNTU, Bhopal",
        city: "Bhopal",
        state: "Madhya Pradesh",
        cellTheme: "AGRITECH",
        websiteUrl: "https://rntu.ac.in",
      },
    }),
    prisma.institution.upsert({
      where: { name: "Scope Global Skills University, Bhopal" },
      update: {},
      create: {
        name: "Scope Global Skills University, Bhopal",
        city: "Bhopal",
        state: "Madhya Pradesh",
        cellTheme: "SKILL_DEVELOPMENT",
        websiteUrl: "https://scopeglobal.ac.in",
      },
    }),
  ]);

  console.log(`✅ ${institutions.length} institutions created`);

  // ─── Super Admin ──────────────────────────────────────────────────────────
  const superAdmin = await prisma.user.upsert({
    where: { email: "superadmin@ciisic.in" },
    update: {},
    create: {
      email: "superadmin@ciisic.in",
      name: "Super Admin",
      role: "SUPER_ADMIN",
      passwordHash: await hash("Admin@1234"),
      emailVerified: true,
      isActive: true,
    },
  });
  console.log(`✅ Super admin: ${superAdmin.email}`);

  // ─── CII Admin ────────────────────────────────────────────────────────────
  const ciiAdmin = await prisma.user.upsert({
    where: { email: "admin@ciisic.in" },
    update: {},
    create: {
      email: "admin@ciisic.in",
      name: "CII Admin",
      role: "CII_ADMIN",
      passwordHash: await hash("Admin@1234"),
      emailVerified: true,
      isActive: true,
    },
  });
  console.log(`✅ CII admin: ${ciiAdmin.email}`);

  // ─── Institution SPOC ─────────────────────────────────────────────────────
  const spocUser = await prisma.user.upsert({
    where: { email: "spoc@jlu.edu.in" },
    update: {},
    create: {
      email: "spoc@jlu.edu.in",
      name: "Dr. Priya Sharma",
      role: "INSTITUTION_SPOC",
      passwordHash: await hash("Spoc@1234"),
      emailVerified: true,
      isActive: true,
    },
  });

  await prisma.institutionProfile.upsert({
    where: { userId: spocUser.id },
    update: {},
    create: {
      userId: spocUser.id,
      institutionId: institutions[0].id,
      designation: "Associate Professor & CII Cell Coordinator",
      department: "Management Studies",
    },
  });
  console.log(`✅ Institution SPOC: ${spocUser.email}`);

  // ─── Industry SPOC ────────────────────────────────────────────────────────
  const industryUser = await prisma.user.upsert({
    where: { email: "hr@techcorp.com" },
    update: {},
    create: {
      email: "hr@techcorp.com",
      name: "Rahul Mehta",
      role: "INDUSTRY_SPOC",
      passwordHash: await hash("Industry@1234"),
      emailVerified: true,
      isActive: true,
    },
  });

  const industryProfile = await prisma.industryProfile.upsert({
    where: { userId: industryUser.id },
    update: {},
    create: {
      userId: industryUser.id,
      companyName: "TechCorp Solutions Pvt Ltd",
      industry: "Information Technology",
      websiteUrl: "https://techcorp.example.com",
      isCIIMember: true,
      memberSince: new Date("2023-01-01"),
    },
  });
  console.log(`✅ Industry SPOC: ${industryUser.email}`);

  // ─── Student ──────────────────────────────────────────────────────────────
  const studentUser = await prisma.user.upsert({
    where: { email: "student@jlu.edu.in" },
    update: {},
    create: {
      email: "student@jlu.edu.in",
      name: "Arjun Verma",
      role: "STUDENT",
      passwordHash: await hash("Student@1234"),
      emailVerified: true,
      isActive: true,
    },
  });

  await prisma.studentProfile.upsert({
    where: { userId: studentUser.id },
    update: {},
    create: {
      userId: studentUser.id,
      enrollmentNo: "JLU2024CS001",
      institutionId: institutions[0].id,
      department: "Computer Science & Engineering",
      yearOfStudy: 3,
      skills: ["Python", "Machine Learning", "React", "Data Analysis"],
    },
  });
  console.log(`✅ Student: ${studentUser.email}`);

  // ─── Sample Challenges ────────────────────────────────────────────────────
  const challenge1 = await prisma.challenge.upsert({
    where: { id: "seed-challenge-001" },
    update: {},
    create: {
      id: "seed-challenge-001",
      title: "AI-Powered Customer Churn Prediction System",
      description: `<h2>Overview</h2>
<p>TechCorp Solutions is facing significant customer churn in its SaaS product. We need an intelligent system that can predict which customers are likely to churn in the next 30–90 days.</p>
<h2>Background</h2>
<p>Our product has 50,000+ active users. We have 18 months of behavioral data available including login frequency, feature usage, support tickets, and billing history.</p>`,
      problemStatement:
        "Build a machine learning model that predicts customer churn with >80% accuracy using behavioral and transactional data.",
      domain: "AI_IN_BUSINESS",
      status: "OPEN",
      deadline: new Date(Date.now() + 45 * 24 * 60 * 60 * 1000), // 45 days from now
      budgetRange: "₹50,000 – ₹1,00,000",
      tags: ["Machine Learning", "Python", "Data Science", "SaaS"],
      industryProfileId: industryProfile.id,
      publishedAt: new Date(),
    },
  });

  const challenge2 = await prisma.challenge.upsert({
    where: { id: "seed-challenge-002" },
    update: {},
    create: {
      id: "seed-challenge-002",
      title: "Smart Agriculture Monitoring Dashboard",
      description: `<h2>Overview</h2>
<p>We need a web-based dashboard that integrates IoT sensor data from farms to provide real-time monitoring of soil moisture, temperature, humidity, and crop health.</p>`,
      problemStatement:
        "Design and develop a React-based dashboard that visualizes real-time agricultural sensor data with alerts and historical trend analysis.",
      domain: "AGRITECH",
      status: "OPEN",
      deadline: new Date(Date.now() + 60 * 24 * 60 * 60 * 1000), // 60 days
      budgetRange: "₹25,000 – ₹75,000",
      tags: ["React", "IoT", "Dashboard", "Agriculture", "Data Visualization"],
      industryProfileId: industryProfile.id,
      publishedAt: new Date(),
    },
  });

  console.log(`✅ Sample challenges created: ${challenge1.title}, ${challenge2.title}`);

  // ─── Audit log seeds ──────────────────────────────────────────────────────
  await prisma.auditLog.create({
    data: {
      userId: superAdmin.id,
      action: "USER_REGISTERED",
      entityType: "User",
      entityId: superAdmin.id,
      newValue: { note: "Initial seed" },
    },
  });

  console.log("\n✅ Seed complete!\n");
  console.log("─── Test Credentials ─────────────────────────────────────────");
  console.log("Super Admin:       superadmin@ciisic.in   / Admin@1234");
  console.log("CII Admin:         admin@ciisic.in        / Admin@1234");
  console.log("Institution SPOC:  spoc@jlu.edu.in        / Spoc@1234");
  console.log("Industry SPOC:     hr@techcorp.com        / Industry@1234");
  console.log("Student:           student@jlu.edu.in     / Student@1234");
  console.log("──────────────────────────────────────────────────────────────");
}

main()
  .catch((e) => {
    console.error("❌ Seed failed:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
