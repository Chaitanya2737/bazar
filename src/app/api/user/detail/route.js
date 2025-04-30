import UserModel from "@/model/user.model";
import { NextResponse } from "next/server";
import mongoose from "mongoose";
import connectDB from "@/lib/db";

export async function POST(request) {
  try {
    await connectDB();
    const { id } = await request.json();
    // Check if ID exists
    if (!id) {
      return NextResponse.json(
        { message: "User ID is required" },
        { status: 400 }
      );
    }

    // Validate if the ID is a valid MongoDB ObjectId
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return NextResponse.json(
        { message: "Invalid User ID format" },
        { status: 400 }
      );
    }

    // Find user and exclude sensitive fields
    const user = await UserModel.findById(id).select("-password -__v").lean();
    if (!user) {
      return NextResponse.json({ message: "User not found" }, { status: 404 });
    }

    // Return the user data
    return NextResponse.json(user, { status: 200 });
  } catch (error) {
    console.error("Error fetching user:", error);
    return NextResponse.json(
      {
        message: "Internal Server Error",
        error:
          process.env.NODE_ENV === "development" ? error.message : undefined,
      },
      { status: 500 }
    );
  }
}
