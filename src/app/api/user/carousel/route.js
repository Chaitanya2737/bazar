import cloudinary from "@/lib/cloudinaryConfig";
import UserModel from "@/model/user.model";
import { NextResponse } from "next/server";

export async function POST(request) {
  console.log("POST /api/user/detail called");

  const ALLOWED_TYPES = ["image/jpeg", "image/png", "image/webp"];
  const MAX_FILE_SIZE = 1024 * 1024;
  const MAX_FILES = 5;

  try {
    const formData = await request.formData();
    const id = formData.get("id");
    const businessName = formData.get("businessName");
    const files = formData.getAll("pictures");

    if (!id || !businessName) {
      return NextResponse.json(
        { error: "ID and Business Name are required" },
        { status: 400 }
      );
    }

    if (files.length > MAX_FILES) {
      return NextResponse.json(
        { error: `Too many files, max ${MAX_FILES} allowed` },
        { status: 400 }
      );
    }

    const uploadPromises = files.map(async (file) => {
      try {
        if (!ALLOWED_TYPES.includes(file.type)) {
          return {
            name: file.name,
            reason: `Unsupported type: ${file.type}`,
            success: false,
          };
        }
        if (file.size > MAX_FILE_SIZE) {
          return {
            name: file.name,
            reason: "File size exceeds 100MB",
            success: false,
          };
        }
        const buffer = Buffer.from(await file.arrayBuffer());
        const dataUri = `data:${file.type};base64,${buffer.toString("base64")}`;
        const uploaded = await cloudinary.uploader.upload(dataUri, {
          folder: businessName || "default-carousel",
        });
        return { url: uploaded.secure_url, success: true };
      } catch (uploadErr) {
        return {
          name: file.name,
          reason: "Cloudinary upload failed",
          success: false,
        };
      }
    });

    const results = await Promise.all(uploadPromises);
    const uploadedUrls = results.filter((r) => r.success).map((r) => r.url);
    const failedFiles = results
      .filter((r) => !r.success)
      .map((r) => ({ name: r.name, reason: r.reason }));

    if (uploadedUrls.length > 0) {
      const updatedUser = await UserModel.findByIdAndUpdate(
        id,
        { $push: { carauselImages: { $each: uploadedUrls } } },
        { new: true, runValidators: true }
      );

      if (!updatedUser) {
        return NextResponse.json(
          { error: "User not found or update failed" },
          { status: 404 }
        );
      }
    }

    return NextResponse.json(
      {
        success: true,
        message: "Upload process completed",
        uploaded: uploadedUrls,
        failed: failedFiles,
      },
      { status: 207 }
    );
  } catch (error) {
    console.error("Error in POST handler for user ID:", id, "Error:", error);
    return NextResponse.json(
      { error: "Something went wrong" },
      { status: 500 }
    );
  }
}




function extractPublicId(url) {
  const match = url.match(/upload\/(?:v\d+\/)?(.+?)\.(jpg|jpeg|png|webp)$/);
  return match ? match[1] : null;
}

export async function DELETE(request) {
  try {
    const { userId, imageUrl } = await request.json();

    if (!userId || !imageUrl) {
      return NextResponse.json(
        { success: false, error: "Missing userId or imageUrl" },
        { status: 400 }
      );
    }

    // Delete from Cloudinary
    const publicId = extractPublicId(imageUrl);
    if (publicId) {
    const status =  await cloudinary.uploader.destroy(publicId);
    console.log(status);
      
    } else {
      console.warn("Could not extract public_id from URL:", imageUrl);
    }

    // Remove from DB
    const updatedUser = await UserModel.findByIdAndUpdate(
      userId,
      { $pull: { carauselImages: imageUrl } },
      { new: true }
    );

    if (!updatedUser) {
      return NextResponse.json(
        { success: false, error: "User not found" },
        { status: 404 }
      );
    }

    console.log(updatedUser);

    return NextResponse.json(
      { success: true, message: "Image deleted", user: updatedUser.carauselImages },
      { status: 200 }
    );
  } catch (error) {
    console.error("DELETE handler error:", error);
    return NextResponse.json(
      { success: false, error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
