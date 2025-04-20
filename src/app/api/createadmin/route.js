import connectDB from "@/lib/db";
import AdminModel from "@/model/admin.model";
import bcrypt from "bcryptjs";
import { NextResponse } from "next/server";

export async function POST(request) {
  try {
    await connectDB();

    const { email, name, password, mobileNumber } = await request.json();

    if (!email || !name || !password || !mobileNumber) {
      return NextResponse.json({ success: false, msg: "All values are required" }, { status: 400 });
    }

    // Check if admin already exists
    const existingAdmin = await AdminModel.findOne({ email });
    if (existingAdmin) {
      return NextResponse.json({ success: false, msg: "Admin already exists" }, { status: 409 });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newAdmin = new AdminModel({
      email,
      name,
      password: hashedPassword,
      mobileNumber,
    });

    await newAdmin.save();

    return NextResponse.json({
      success: true,
      msg: "Admin created successfully",
      data: {
        id: newAdmin._id,
        email: newAdmin.email,
        name: newAdmin.name,
      },
    }, { status: 201 });

  } catch (error) {
    console.error("Admin creation error:", error);
    return NextResponse.json({ success: false, msg: "Internal Server Error" }, { status: 500 });
  }
}
