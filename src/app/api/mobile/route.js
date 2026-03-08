import connectDB from "@/lib/db";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { NextResponse } from "next/server";
import UserModel from "@/model/user.model";
import AdminModel from "@/model/admin.model";
import SystemModel from "@/model/system.model";

// Map role to collection
const roleCollectionMap = {
  user: UserModel,
  admin: AdminModel,
  system: SystemModel,
};

export async function POST(request) {
  try {
    await connectDB();

    const body = await request.json();
    const { email, password, role } = body;

    if (!role || !roleCollectionMap[role]) {
      return NextResponse.json(
        { success: false, msg: "Invalid role" },
        { status: 400 }
      );
    }

    const Model = roleCollectionMap[role];

    const findUser = await Model.findOne({ email });

    if (!findUser) {
      return NextResponse.json(
        { success: false, msg: "User not found" },
        { status: 404 }
      );
    }

    const isMatch = await bcrypt.compare(password, findUser.password);
    if (!isMatch) {
      return NextResponse.json(
        { success: false, msg: "Invalid password" },
        { status: 401 }
      );
    }

    // Generate JWT
    const token = jwt.sign(
      {
        id: findUser._id,
        email: findUser.email,
        role: findUser.role,
      },
      process.env.NEXTAUTH_SECRET,
      { expiresIn: "7d" }
    );

    return NextResponse.json({
      success: true,
      token,
      user: {
        id: findUser._id,
        businessName: findUser.businessName || "",
        handlerName: findUser.handlerName || "",
        email: findUser.email,
        role: findUser.role,
      },
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, msg: error.message },
      { status: 500 }
    );
  }
}