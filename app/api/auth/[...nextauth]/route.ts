import connect from "@/app/lib/server/mongodb";
import User from "@/app/models/user";
import bcrypt from "bcrypt";
import NextAuth from "next-auth";
import credentials from "next-auth/providers/credentials";
import github from "next-auth/providers/github";
import google from "next-auth/providers/google";
import { nanoid } from "nanoid";

export const authOptions: any = {
  providers: [
    credentials({
      name: "Credentials",
      id: "credentials",
      credentials: {
        email: { label: "Email", type: "text" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials: any) {
        await connect();
        try {
          const user = await User.findOne({ email: credentials.email });
          if (user) {
            const isPasswordValid = await bcrypt.compare(credentials.password, user.password);
            if (isPasswordValid) {
              return Promise.resolve({ email: user.email });
            };
          }
          return null;
        } catch (error) {
          console.error(error);
          return null;
        }
      },
    }),
    github({
      clientId: process.env.GITHUB_ID,
      clientSecret: process.env.GITHUB_SECRET,
    }),
    google({
      clientId: process.env.GOOGLE_ID,
      clientSecret: process.env.GOOGLE_SECRET,
    }),
  ],
  secret: "Yo/0duPLAErkzTcBlgWGWR4eaVyivqU6a+M/ot0fo9c=",
  session: {
    strategy: "jwt",
    maxAge: 30 * 24 * 60 * 60, // 30 days
    updateAge: 24 * 60 * 60, // 24 hours
    generateSessionToken: nanoid(),
  },
  callbacks: {
    async jwt(token: any, user: any) {
      if (user) {
        token.id = user._id;
      }
      return token;
    },
    async session(session: any, user: any) {
      // console.log("session", session);
      // console.log("user", user);      
      session.user = session.token.token.user;
      return session;
    },
  },
};

export const { handlers: { GET, POST }, auth } = NextAuth(authOptions);
