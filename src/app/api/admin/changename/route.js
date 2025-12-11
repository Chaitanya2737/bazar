import connectDB from "@/lib/db";
import UserModel from "@/model/user.model";
import { NextResponse } from "next/server";

export async function POST(request) {
  try {
    await connectDB();

    const { id, updatedName } = await request.json();

    if (!id) {
      return NextResponse.json(
        { success: false, message: "ID not provided" },
        { status: 400 }
      );
    }

    if (!updatedName || updatedName.trim() === "") {
      return NextResponse.json(
        { success: false, message: "Updated name is required" },
        { status: 400 }
      );
    }

    const updatedUser = await UserModel.findByIdAndUpdate(
      id,
      { businessName: updatedName },
      { new: true }
    );

    if (!updatedUser) {
      return NextResponse.json(
        { success: false, message: "User not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      message: "Name updated successfully",
    });

  } catch (error) {
    console.error("Error updating name:", error);
    return NextResponse.json(
      { success: false, message: "Internal server error", error: error.message },
      { status: 500 }
    );
  }
}
