import NextAuth from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import { PrismaAdapter } from '@next-auth/prisma-adapter';
import { PrismaClient, User } from '@prisma/client';
import bcrypt from 'bcryptjs'; // Import bcrypt for password hashing
import { JWT } from 'next-auth/jwt'; // Import JWT type
import { Session } from 'next-auth'; // Import Session type

const prisma = new PrismaClient();

export const authOptions = {
  adapter: PrismaAdapter(prisma),
  providers: [
    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        username: { label: "Username", type: "text", placeholder: "username" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials) {
        if (!credentials) {
          return null; // Return null if credentials are undefined
        }

        // Find the user by email
        const user = await prisma.user.findUnique({
          where: { username: credentials.username }
        });
        //bcrypt.compare(credentials.password, user.password)
        // Check if user exists and if the password is correct
        if (user && await credentials.password === user.password) {
          return user; // Return user object if authentication is successful
        } else {
          return null; // Return null if authentication fails
        }
      }
    }),
    // Add other providers here (e.g., Google, GitHub, etc.)
  ],
  session: {
    strategy: 'jwt' as const, // Ensure this is typed correctly
  },
  pages: {
    signIn: '/admin/login',
  },
  callbacks: {
    async jwt({ token, user }: { token: JWT; user?: any }) {
      if (user) {
        token.id = user.id;
        token.name = user.username;
      }

      return token;
    },
    async session({ session, token }: { session: Session; token: JWT }) {
      if (token) {
        session.user = session.user || {};

        session.user.id = token.id as string;
        session.user.name = token.name as string;
        session.user.email = token.name as string;
        session.user.image = null;
      }
      return session;
    }
  },
  secret: process.env.NEXTAUTH_SECRET, // Set a secret for JWT signing
};

export default NextAuth(authOptions);