import cloudinary from "@/lib/cloudinaryConfig";
import UserModel from "@/model/user.model";
import { NextResponse } from "next/server";

const ALLOWED_TYPES = ["image/jpeg", "image/png", "image/webp"];
const MAX_FILE_SIZE = 1024 * 1024 * 100; // 100MB
const MAX_FILES = 5;

export async function POST(request) {
  let id; // define early for catch block

  try {
    const formData = await request.formData();
    id = formData.get("id");
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

    const safeFolder = `${businessName || "business-icons"}-${id}`
      .trim()
      .replace(/\s+/g, "-")
      .replace(/[^a-zA-Z0-9-_]/g, "")
      .toLowerCase();

    const uploadPromises = files.map(async (file) => {
      try {
        if (!ALLOWED_TYPES.includes(file.type)) {
          return { name: file.name, reason: `Unsupported type: ${file.type}`, success: false };
        }
        if (file.size > MAX_FILE_SIZE) {
          return { name: file.name, reason: "File size exceeds 100MB", success: false };
        }

        const buffer = Buffer.from(await file.arrayBuffer());
        const dataUri = `data:${file.type};base64,${buffer.toString("base64")}`;

        const uploaded = await cloudinary.uploader.upload(dataUri, {
          folder: safeFolder,
        });

        return { url: uploaded.secure_url, success: true };
      } catch (uploadErr) {
        console.error("Upload error:", uploadErr);
        return { name: file.name, reason: "Cloudinary upload failed", success: false };
      }
    });

    const results = await Promise.all(uploadPromises);
    const uploadedUrls = results.filter((r) => r.success).map((r) => r.url);
    const failedFiles = results.filter((r) => !r.success);

    if (uploadedUrls.length > 0) {
      const updatedUser = await UserModel.findByIdAndUpdate(
        id,
        { $push: { carauselImages: { $each: uploadedUrls } } }, // ✅ fix schema name if typo
        { new: true, runValidators: true }
      );

      if (!updatedUser) {
        return NextResponse.json({ error: "User not found" }, { status: 404 });
      }
    }

    return NextResponse.json({
      success: true,
      uploaded: uploadedUrls,
      failed: failedFiles,
    });
  } catch (error) {
    console.error("Error in POST handler for user ID:", id, "Error:", error);
    return NextResponse.json({ error: "Something went wrong" }, { status: 500 });
  }
}

// Utility: Extract Cloudinary public_id
function extractPublicId(url) {
  const match = url.match(/\/upload\/(?:v\d+\/)?([^/.]+)\.[^/]+$/);
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

    const publicId = extractPublicId(imageUrl);
    if (publicId) {
      const status = await cloudinary.uploader.destroy(publicId);
      console.log("Cloudinary delete:", status);
    } else {
      console.warn("Could not extract public_id from URL:", imageUrl);
    }

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
