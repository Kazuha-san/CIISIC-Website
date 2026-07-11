import NextAuth, { type DefaultSession } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { PrismaAdapter } from "@auth/prisma-adapter";
import { prisma } from "./prisma";
import { verifyPassword } from "./password";
import type { Role } from "@prisma/client";

// Extend NextAuth types to include role and id
declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      email: string;
      name: string;
      role: Role;
      avatarUrl: string | null;
    } & DefaultSession["user"];
  }
  interface User {
    role: Role;
    avatarUrl?: string | null;
  }
}

export const { handlers, auth, signIn, signOut } = NextAuth({
  adapter: PrismaAdapter(prisma),
  session: {
    strategy: "jwt",
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          throw new Error("Email and password are required");
        }

        const user = await prisma.user.findUnique({
          where: { email: credentials.email as string },
        });

        if (!user) {
          throw new Error("No account found with this email");
        }

        if (!user.isActive) {
          throw new Error("Your account has been deactivated");
        }

        if (!user.passwordHash) {
          throw new Error("This account uses a different sign-in method");
        }

        const valid = await verifyPassword(
          credentials.password as string,
          user.passwordHash
        );

        if (!valid) {
          throw new Error("Incorrect password");
        }

        return {
          id: user.id,
          email: user.email,
          name: user.name,
          role: user.role,
          avatarUrl: user.avatarUrl,
        };
      },
    }),
  ],
  callbacks: {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    async jwt({ token, user }: { token: any; user?: any }) {
      if (user) {
        token.id = user.id as string;
        token.role = user.role as Role;
        token.avatarUrl = (user.avatarUrl as string | null) ?? null;
      }
      return token;
    },
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    async session({ session, token }: { session: any; token: any }) {
      if (token) {
        session.user.id = token.id as string;
        session.user.role = token.role as Role;
        session.user.avatarUrl = (token.avatarUrl as string | null) ?? null;
      }
      return session;
    },
  },
  events: {
    async signIn(message) {
      if (message?.user?.id) {
        await prisma.auditLog.create({
          data: {
            userId: message.user.id,
            action: "USER_LOGIN",
            entityType: "User",
            entityId: message.user.id,
            newValue: { email: message.user.email },
          },
        }).catch(console.error);
      }
    }
  },
  pages: {
    signIn: "/api/auth/signin",
    error: "/api/auth/error",
  },
  secret: process.env.NEXTAUTH_SECRET,
});
