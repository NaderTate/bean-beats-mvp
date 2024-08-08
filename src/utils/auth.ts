import NextAuth from "next-auth";
import { PrismaAdapter } from "@auth/prisma-adapter";
import Google from "next-auth/providers/google";
import CredentialsProvider from "next-auth/providers/credentials";
import prisma from "@/lib/prisma";
import bcrypt from "bcrypt";
export const { handlers, auth, signIn, signOut } = NextAuth({
  trustHost: true,
  adapter: PrismaAdapter(prisma),
  providers: [
    Google({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    }),
    CredentialsProvider({
      type: "credentials",
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "text" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          return null;
        }
        const user = await prisma.user.findUnique({
          where: { email: credentials.email as string },
        });
        if (!user || !user.password) {
          return null;
        }
        const isPasswordValid = await bcrypt.compare(
          credentials.password as string,
          user.password
        );
        if (!isPasswordValid) {
          return null;
        }
        return user;
      },
    }),
  ],
  session: {
    strategy: "jwt",
  },
  callbacks: {
    async session({ session, token }) {
      // Assign the user ID from the JWT token to the session
      session.user.id = token.sub as string;
      return session;
    },
    async jwt({ token, user }) {
      // If user object is available, add the `id` to the JWT token
      if (user) {
        token.sub = user.id;
      }
      return token;
    },
    // create a shop for the user if he doesn't have one
    // signIn: async (user) => {
    //   if (user) {
    //     const email = user?.user?.email || user?.email;
    //     const userWithShop = await prisma.user.findUnique({
    //       where: { email: email as string },
    //     });

    //     const shop = await prisma.coffeeShop.findFirst({
    //       where: { adminId: userWithShop?.id },
    //     });

    //     if (!shop) {
    //       await prisma.coffeeShop.create({
    //         data: {
    //           name: "My Shop",
    //           adminId: userWithShop?.id as string,
    //           address: "My Address",
    //           revenueShare: 0.1,
    //           workingHours: {
    //             sunday: { open: 0, close: 0 },
    //           },
    //         },
    //       });
    //     }
    //   }
    //   return true;
    // },
  },
  jwt: {
    maxAge: 30 * 24 * 60 * 60,
    // You can define your own encode/decode functions for signing and encryption
  },
});
