import { getServerSession } from "next-auth";
import { authOptions } from "../../auth/[...nextauth]/route";
import { NextResponse } from "next/server";
import cloudinary from "@/lib/cloudinaryConfig";
import connectDB from "@/lib/db";
import UserProductModel from "@/model/product/user.product.model";

export async function POST(request) {
  await connectDB();

  const formData = await request.formData();
  const title = formData.get("title");
  const description = formData.get("description");
  const thumbnail = formData.get("thumbnail");
  const formUserId = formData.get("userId");
  const businessName = formData.get("businessName");

  // ✅ Check required fields
  if (!title || !thumbnail || !formUserId) {
    return NextResponse.json(
      { success: false, message: "Missing required fields" },
      { status: 400 }
    );
  }

  // ✅ Check thumbnail type and size
  if (!thumbnail.type.startsWith("image/")) {
    return NextResponse.json(
      { success: false, message: "Only image files are allowed" },
      { status: 400 }
    );
  }
  // ⛔ Check if user already has 5 products
  const existingProductCount = await UserProductModel.countDocuments({
    userId: formUserId,
  });
  if (existingProductCount >= 20) {
    return NextResponse.json(
      { success: false, message: "You can only add up to 5 products." },
      { status: 400 }
    );
  }

  const MAX_SIZE = 5 * 1024 * 1024; // 5MB
  if (thumbnail.size > MAX_SIZE) {
    return NextResponse.json(
      { success: false, message: "Image size should not exceed 5MB" },
      { status: 400 }
    );
  }

  // ✅ Session validation
  const session = await getServerSession(authOptions);
  if (!session) {
    return NextResponse.json(
      { success: false, message: "User is not authenticated" },
      { status: 401 }
    );
  }

  const sessionUserId = session.user.id;
  if (formUserId !== sessionUserId) {
    return NextResponse.json(
      {
        success: false,
        message: "User ID does not match session. Unauthorized access.",
      },
      { status: 403 }
    );
  }

  // 🖼️ Upload image to Cloudinary
  let businessIconUrl;
  try {
    const arrayBuffer = await thumbnail.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);
    const base64 = buffer.toString("base64");
    const dataUri = `data:${thumbnail.type};base64,${base64}`;

     const safeBusinessName = (businessName || "business-icons")
      .trim()
      .replace(/\s+/g, "-") // replace spaces with hyphens
      .replace(/[^a-zA-Z0-9-_]/g, "") // remove special chars
      .toLowerCase();

    const uploaded = await cloudinary.uploader.upload(dataUri, {
      folder: safeBusinessName,
    });



    businessIconUrl = uploaded.secure_url;
  } catch (uploadErr) {
    console.error("Cloudinary upload error:", uploadErr);
    return NextResponse.json(
      { success: false, message: "Failed to upload image to Cloudinary" },
      { status: 500 }
    );
  }

  try {
    const newProduct = new UserProductModel({
      title,
      description,
      thumbnail: businessIconUrl,
      userId: formUserId,
    });

    await newProduct.save();

    return NextResponse.json(
      {
        success: true,
        message: "Product uploaded successfully",
        product: {
          id: newProduct._id,
          title: newProduct.title,
          description: newProduct.description,
          thumbnail: newProduct.thumbnail,
        },
      },
      { status: 200 }
    );
  } catch (saveErr) {
    console.log("Database save error:", saveErr);
    return NextResponse.json(
      { success: false, message: "Failed to save product" },
      { status: 500 }
    );
  }
}
