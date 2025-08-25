// app/api/users/route.js
import connectDB from "@/lib/db";
import UserModel from "@/model/user.model";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    // Connect to database
    await connectDB();

    // Fetch only businessName & slug fields for indexing
    const users = await UserModel.find({}, "businessName slug").lean();

    return NextResponse.json(
      {
        success: true,
        count: users.length,
        users,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("❌ Error fetching users:", error);
    return NextResponse.json(
      {
        success: false,
        message: "Internal server error",
      },
      { status: 500 }
    );
  }
}
