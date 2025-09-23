import connectDB from "@/lib/db";
import UserModel from "@/model/user.model";
import { NextResponse } from "next/server";

export async function POST(request) {
  try {
    await connectDB();
    const body = await request.json();


    console.log(body);
    const { addValue, id, platform } = body;

    if (!id || !platform || !addValue) {
      return NextResponse.json(
        { error: "User ID, platform, and value are required" },
        { status: 400 }
      );
    }

    // Update the social media link for the specified platform
    const updatedUser = await UserModel.findByIdAndUpdate(
      id,
      { $set: { [`socialMediaLinks.${platform}`]: addValue } },
      { new: true }
    ).lean();

    if (!updatedUser) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    return NextResponse.json(
      { success: true, message: "Social media link updated", platform, addValue, id },
      { status: 200 }
    );
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}


export async function DELETE(request) {
  try {
    await connectDB();
    const body = await request.json();

    console.log(body);
    const { id, platform } = body;

    if (!id || !platform) {
      return NextResponse.json(
        { error: "User ID and platform are required" },
        { status: 400 }
      );
    }

    // Remove the social media link for the specified platform
    const updatedUser = await UserModel.findByIdAndUpdate(
      id,
      { $unset: { [`socialMediaLinks.${platform}`]: "" } },
      { new: true }
    ).lean();

    if (!updatedUser) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    return NextResponse.json(
      {
        success: true,
        message: `${platform} link removed successfully`,
        platform,
        id,
        socialMediaLinks: updatedUser.socialMediaLinks,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
