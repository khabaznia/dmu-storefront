import NextAuth from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import prisma from '@/lib/prisma';
import { compare } from 'bcryptjs';
import { NextRequest, NextResponse } from 'next/server';

export const authOptions = {
  providers: [
    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        username: { label: "Логін", type: "text" },
        password: { label: "Пароль", type: "password" },
      },
      async authorize(credentials: any) {
        if (!credentials?.username || !credentials?.password) {
          return null;
        }
        const user = await prisma.user.findUnique({
          where: { username: credentials.username },
        });
        if (!user) {
          return null;
        }
        const isPasswordValid = await compare(credentials.password, user.password);
        if (!isPasswordValid) {
          return null;
        }
        return { id: user.id.toString(), name: user.username };
      },
    }),
  ],
  session: {
    strategy: 'jwt' as const,
    maxAge: 30 * 24 * 60 * 60, // 30 днів
  },
  pages: {
    signIn: '/login',
  },
  callbacks: {
    async session({ session, token }: any) {
      if (token && session.user) {
        session.user.id = token.sub;
      }
      return session;
    },
  },
};

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST }; 