import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import cloudinary from "@/lib/cloudinaryConfig";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import connectDB from "@/lib/db";
import UserModel from "@/model/user.model";

export async function POST(request) {
  try {
    await connectDB();

    // ✅ Parse multipart form data
    const formData = await request.formData();
    const userId = formData.get("userId");
    const oldFileURL = formData.get("oldFile");
    const file = formData.get("file");
    console.log(userId, oldFileURL, file);

    if (!userId || !file) {
      return NextResponse.json(
        { error: "User ID and file are required" },
        { status: 400 }
      );
    }

    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json(
        { success: false, message: "User is not authenticated" },
        { status: 401 }
      );
    }

    // ✅ Step 1: Delete old Cloudinary image (if exists)
    if (oldFileURL) {
      try {
        // Extract public_id safely from Cloudinary URL
        const parts = oldFileURL.split("/");
        const filename = parts.pop(); // e.g. mylogo.png
        const publicId = filename.split(".")[0]; // e.g. mylogo
        await cloudinary.uploader.destroy(`business-icons/${publicId}`);
        console.log("🗑️ Deleted old image:", publicId);
      } catch (err) {
        console.error("⚠️ Cloudinary deletion failed:", err.message);
      }
    }

    // ✅ Step 2: Upload new file to Cloudinary
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    // Cloudinary upload using stream (best for file buffers)
    const uploadResponse = await new Promise((resolve, reject) => {
      const stream = cloudinary.uploader.upload_stream(
        { folder: "business-icons" },
        (error, result) => {
          if (error) reject(error);
          else resolve(result);
        }
      );
      stream.end(buffer);
    });

    const logoUrl = uploadResponse.secure_url;
    console.log(logoUrl);

    // ✅ Step 3: Update user logo in DB
    const updatedUser = await UserModel.findByIdAndUpdate(
      userId,
      { $set: { businessIcon: logoUrl } },
      { new: true }
    ).lean();

    if (!updatedUser) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    return NextResponse.json(
      {
        success: true,
        message: "Logo updated successfully",
        logoUrl,
        userId,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("❌ Internal error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
