import connectDB from "@/lib/db";
import UserModel from "@/model/user.model";
import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { NextResponse } from "next/server";
import bcrypt from "bcrypt";
export const authOptions = {
  providers: [
    CredentialsProvider({
      // The name to display on the sign in form (e.g. "Sign in with...")
      name: "Credentials",
      // `credentials` is used to generate a form on the sign in page.
      // You can specify which fields should be submitted, by adding keys to the `credentials` object.
      // e.g. domain, username, password, 2FA token, etc.
      // You can pass any HTML attribute to the <input> tag through the object.
      credentials: {
        username: { label: "Username", type: "text", placeholder: "jsmith" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials, req) {
        await connectDB();
        if (req.headers?.referer.includes("sign-in")) {
          // connect to admin collections
          const findUser = await UserModel.findOne({
            email: credentials.email,
          });

          if (!findUser) {
            throw new Error("User not found in database");
          }

          if (findUser.role !== "admin") {
            throw new Error("Role not matched");
          }

          const isMatch = await bcrypt.compare(
            credentials.password,
            findUser.password
          );
          if (!isMatch) {
            throw new Error("Incorrect password");
          }

          const userObject = {
            _id: findUser._id,
            name: findUser.name,
            email: findUser.email,
            role: findUser.role,
          };

          return userObject;
        } else if (req.headers?.referer.includes("/admin/signup")) {
          // connect to user collections
          const findAdmin = await UserModel.findOne({
            email: credentials.email,
          });

          if (!findAdmin) {
            throw new Error("User not found in database");
          }

          if (findAdmin.role !== "admin") {
            throw new Error("Role not matched");
          }

          const isMatch = await bcrypt.compare(
            credentials.password,
            findAdmin.password
          );
          if (!isMatch) {
            throw new Error("Incorrect password");
          }

          const userObject = {
            _id: findAdmin._id,
            name: findAdmin.name,
            email: findAdmin.email,
            role: findAdmin.role,
          };

          return userObject;
        } else if (req.headers?.referer.includes("system")) {
          // connect to system
             // connect to admin collections
             const findUser = await UserModel.findOne({
              email: credentials.email,
            });
  
            if (!findSystem) {
              throw new Error("User not found in database");
            }
  
            if (findSystem.role !== "admin") {
              throw new Error("Role not matched");
            }
  
            const isMatch = await bcrypt.compare(
              credentials.password,
              findSystem.password
            );
            if (!isMatch) {
              throw new Error("Incorrect password");
            }
  
            const userObject = {
              _id: findSystem._id,
              name: findSystem.name,
              email: findSystem.email,
              role: findSystem.role,
            };
            return userObject;
        } else {
          return "unable to find role";
        }
      },
    }),
  ],

  session: {
    strategy: "jwt",
  },
  secret: process.env.NEXTAUTH_SECRET || "abcdbdbdbdb",

  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user._id.toString();
        token.name = user.name;
      }
      return token;
    },
    async session({ session, token }) {
      session.user.id = token.id;
      return session;
    },
  },
};

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };
