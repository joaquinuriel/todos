import { PrismaAdapter } from "@next-auth/prisma-adapter";
import prisma from "@prisma";
import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import GithubProvider from "next-auth/providers/github";

export default NextAuth({
  adapter: PrismaAdapter(prisma),
  session: { strategy: "jwt" },
  pages: {
    signIn: "/",
    signOut: "/",
    error: "/",
    newUser: "/signup",
  },
  callbacks: {
    async jwt({ token, user }) {
      // console.log("profile", profile)
      if (user) token.uid = user.id;
      return token;
    },
    async session({ session, token }) {
      if (!session.user) return session;
      session.user.id = token.uid;
      return session;
    },
  },
  // Configure one or more authentication providers
  providers: [
    GithubProvider({
      clientId: process.env.GITHUB_ID!,
      clientSecret: process.env.GITHUB_SECRET!,
    }),
    // ...add more providers here
    CredentialsProvider({
      // The name to display on the sign in form (e.g. 'Sign in with...')
      name: "Credentials",
      // The credentials is used to generate a suitable form on the sign in page.
      // You can specify whatever fields you are expecting to be submitted.
      // e.g. domain, username, password, 2FA token, etc.
      // You can pass any HTML attribute to the <input> tag through the object.
      credentials: {
        username: { label: "Username", type: "text" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        const { username, password } = credentials!;
        const res = await prisma.credentials.findUnique({
          where: { username },
          include: { user: true },
        });

        if (!res) return null;
        if (res.password !== password) return null;

        return { ...res.user, username };
      },
    }),
  ],
});
