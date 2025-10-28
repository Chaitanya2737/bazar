export const runtime = "nodejs";

import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import cloudinary from "@/lib/cloudinaryConfig";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import connectDB from "@/lib/db";
import UserModel from "@/model/user.model";
import mongoose from "mongoose";

export async function POST(request) {
  try {
    await connectDB();
    const formData = await request.formData();
    const userId = formData.get("userId");
    const oldFileURL = formData.get("oldFile");
    const file = formData.get("file");

    console.log("🧩 Incoming data:", {
      userId,
      oldFileURL,
      fileType: file?.type,
    });

    if (!userId || !file) {
      return NextResponse.json(
        { error: "User ID and file are required" },
        { status: 400 }
      );
    }

    if (!mongoose.Types.ObjectId.isValid(userId)) {
      return NextResponse.json(
        { error: "Invalid user ID format" },
        { status: 400 }
      );
    }

    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json(
        { success: false, message: "User not authenticated" },
        { status: 401 }
      );
    }

    // Delete old file if exists
    if (oldFileURL) {
      try {
        const parts = oldFileURL.split("/");
        const filename = parts.pop();
        const publicId = filename.split(".")[0];
        await cloudinary.uploader.destroy(`business-icons/${publicId}`);
        console.log("🗑️ Deleted old image:", publicId);
      } catch (err) {
        console.error("⚠️ Cloudinary deletion failed:", err.message);
      }
    }

    // ✅ Declare logoUrl outside
    let logoUrl = null;

    // Upload new file
    if (!(file instanceof Blob)) {
      return NextResponse.json({ error: "Invalid file type" }, { status: 400 });
    }

    try {
      const arrayBuffer = await file.arrayBuffer();
      const buffer = Buffer.from(arrayBuffer);

      const uploadResponse = await new Promise((resolve, reject) => {
        const stream = cloudinary.uploader.upload_stream(
          { folder: "business-icons" },
          (error, result) => {
            if (error) return reject(error);
            resolve(result);
          }
        );
        stream.end(buffer);
      });

      logoUrl = uploadResponse.secure_url;
      console.log("✅ Cloudinary upload success:", logoUrl);
    } catch (error) {
      console.error("❌ Cloudinary upload error:", error.message);
      return NextResponse.json(
        { error: "Failed to upload image to Cloudinary" },
        { status: 500 }
      );
    }

    if (!logoUrl) {
      return NextResponse.json(
        { error: "Upload failed, no URL returned" },
        { status: 500 }
      );
    }

    const updatedUser = await UserModel.findByIdAndUpdate(
      userId,
      { $set: { businessIcon: logoUrl } },
      { new: true }
    ).lean();

    if (!updatedUser) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    return NextResponse.json({
      success: true,
      message: "Logo updated successfully",
      logoUrl,
      userId,
    });
  } catch (error) {
    console.error("❌ Internal error:", error.stack || error.message);
    return NextResponse.json(
      { error: error.message || "Internal server error" },
      { status: 500 }
    );
  }
}
