import cloudinary from "@/lib/cloudinaryConfig";
import connectDB from "@/lib/db";
import SuggestionProduct from "@/model/suggestionproduct/suggestion.model";
import { NextResponse } from "next/server";

export async function POST(request) {
  try {
    await connectDB();

    const formData = await request.formData();

    const title = formData.get("title");
    const category_id = formData.get("category_id");
    const image = formData.get("image");
    const description = formData.get("description");

    if (!title || !category_id || !image) {
      return NextResponse.json(
        { success: false, message: "Missing required fields" },
        { status: 400 },
      );
    }

    const arrayBuffer = await image.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);
    const base64 = buffer.toString("base64");
    const dataUri = `data:${image.type};base64,${base64}`;

    // Upload to Cloudinary
    const uploadResult = await cloudinary.uploader.upload(dataUri, {
      folder: "suggestion",
    });

    const imageUrl = uploadResult.secure_url;

    const suggestionproduct = new SuggestionProduct({
      title,
      description,
      category_id,
      images: imageUrl
    });

    await suggestionproduct.save();

    return NextResponse.json(
      {
        success: true,
        data: {
          category_id,
          title,
          description,
          imageUrl,
        },
      },
      { status: 200 },
    );
  } catch (error) {
    console.error("Server error:", error);

    return NextResponse.json(
      { success: false, message: "Internal Server Error" },
      { status: 500 },
    );
  }
}
