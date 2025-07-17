import UserModel from "@/model/user.model";
import { NextResponse } from "next/server";
import connectDB from "@/lib/db";
import { getServerSession } from "next-auth";
import { authOptions } from "../../auth/[...nextauth]/route";

export async function POST(request) {
  try {
    await connectDB();

    const { id, link } = await request.json();

    if (!id || !link) {
      return NextResponse.json(
        { message: "User ID and video link are required" },
        { status: 400 }
      );
    }

    const session = await getServerSession(authOptions);

    if (!session) {
      return NextResponse.json(
        { message: "User is not authenticated" },
        { status: 401 }
      );
    }

    // Optional strict check
    // if (session.user.id !== id) {
    //   return NextResponse.json(
    //     { message: "Unauthorized" },
    //     { status: 403 }
    //   );
    // }

    const updatedUser = await UserModel.findByIdAndUpdate(
      id,
      { $push: { videoUrl: link } },
      { new: true, runValidators: true }
    );

    if (!updatedUser) {
      return NextResponse.json({ message: "User not found" }, { status: 404 });
    }

    console.log(updatedUser.videoUrl);

    return NextResponse.json(
      { message: "Video link added successfully" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error updating user video link:", error);
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
