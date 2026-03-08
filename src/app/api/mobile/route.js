import connectDB from "@/lib/db";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { NextResponse } from "next/server";
import UserModel from "@/model/user.model";
import AdminModel from "@/model/admin.model";
import SystemModel from "@/model/system.model";

// Map role to MongoDB collection
const roleCollectionMap = {
  user: UserModel,
  admin: AdminModel,
  system: SystemModel,
};

export async function POST(request) {
  try {
    await connectDB();

    const body = await request.json();
    const { email, password, role, deviceId } = body;

    // Check role
    if (!role || !roleCollectionMap[role]) {
      return NextResponse.json(
        { success: false, msg: "Invalid role" },
        { status: 400 },
      );
    }

    // Device ID required for mobile login
    if (!deviceId) {
      return NextResponse.json(
        { success: false, msg: "Device ID required" },
        { status: 400 },
      );
    }

    // Pick the correct collection based on role
    const Model = roleCollectionMap[role];

    const user = await Model.findOne({ email });
    if (!user)
      return NextResponse.json(
        { success: false, msg: "User not found" },
        { status: 404 },
      );

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch)
      return NextResponse.json(
        { success: false, msg: "Invalid password" },
        { status: 401 },
      );

    // --- Device activation check ---
    if (role === "user") {
      // Only enforce device limit for normal users
      const isDeviceRegistered = user.deviceActivations?.some(
        (d) => d.deviceId === deviceId,
      );

      if (!isDeviceRegistered) {
        const maxDevices = user.maxDevices || 1;
        if ((user.deviceActivations?.length || 0) >= maxDevices) {
          return NextResponse.json(
            { success: false, msg: "Device limit reached" },
            { status: 403 },
          );
        }

        user.deviceActivations = user.deviceActivations || [];
        user.deviceActivations.push({ deviceId, activatedAt: new Date() });
        await user.save();
      }
    }

    const token = jwt.sign(
      {
        id: user._id,
        email: user.email,
        role: user.role,
      },
      process.env.NEXTAUTH_SECRET,
    );

    return NextResponse.json({
      success: true,
      token,
      user: {
        id: user._id,
        businessName: user.businessName || "",
        handlerName: user.handlerName || "",
        email: user.email,
        role: user.role,
        subscriptionPlan: user.subscriptionPlan,
      },
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, msg: error.message },
      { status: 500 },
    );
  }
}
