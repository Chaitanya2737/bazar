import connectDB from "@/lib/db";
import UserModel from "@/model/user.model";
import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import bcrypt from "bcrypt";
import AdminModel from "@/model/admin.model";

export const authOptions = {
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email", placeholder: "you@example.com" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials, req) {
        await connectDB();

        const referer = req.headers?.referer || "";
        let expectedRole = "";

        if (referer.includes("/sign-in")) expectedRole = "user";
        else if (referer.includes("/admin/signin")) expectedRole = "admin";
        else if (referer.includes("system")) expectedRole = "system";
        else throw new Error("Invalid authentication route");
        console.log(expectedRole);

        if (expectedRole === "user") {
          const user = await UserModel.findOne({ email: credentials.email });

          if (!user) throw new Error("User not found in database");
          if (user.role !== expectedRole) throw new Error("Role not matched");
  
          const isMatch = await bcrypt.compare(credentials.password, user.password);
          if (!isMatch) throw new Error("Incorrect password");
  
          return {
            _id: user._id.toString(),
            name: user.name,
            email: user.email,
            role: user.role,
          };
        }


        if (expectedRole === "admin") {
          const admin = await AdminModel.findOne({ email: credentials.email });

          if (!admin) throw new Error("admin not found in database");
          if (admin.role !== expectedRole) throw new Error("Role not matched");
  
          const isMatch = await bcrypt.compare(credentials.password, admin.password);
          if (!isMatch) throw new Error("Incorrect password");
  
          return {
            _id: admin._id.toString(),
            name: admin.name,
            email: admin.email,
            role: admin.role,
          };
        }


        if (expectedRole === "system") {
          const user = await UserModel.findOne({ email: credentials.email });

          if (!user) throw new Error("User not found in database");
          if (user.role !== expectedRole) throw new Error("Role not matched");
  
          const isMatch = await bcrypt.compare(credentials.password, user.password);
          if (!isMatch) throw new Error("Incorrect password");
  
          return {
            _id: user._id.toString(),
            name: user.name,
            email: user.email,
            role: user.role,
          };
        }

      
      },
    }),
  ],

  session: {
    strategy: "jwt",
  },
  secret: process.env.NEXTAUTH_SECRET,

  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user._id;
        token.name = user.name;
        token.email = user.email;
        token.role = user.role;
        token.isAuthenticated = true
      }
      return token;
    },
    async session({ session, token }) {
      if (token) {
        session.user = {
          id: token.id,
          name: token.name,
          email: token.email,
          role: token.role,
          isAuthenticated : token.isAuthenticated
        };
      }
      return session;
    },
  },
};

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };
