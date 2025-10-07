import connectDB from "@/lib/db";
import UserModel from "@/model/user.model";
import CategoryModel from "@/model/categories.model";

import { NextResponse } from "next/server";

export async function GET(request) {
  try {
    await connectDB();

    // Get slug from query params
    const { searchParams } = new URL(request.url);
    const slug = searchParams.get("slug");

    if (!slug) {
      return NextResponse.json(
        { success: false, message: "Slug is required" },
        { status: 400 }
      );
    }

    // Decode the slug (for non-ASCII characters)
const decodedSlug = decodeURIComponent(slug).trim();

    // Fetch user by slug
    const user = await UserModel.findOne({ slug: decodedSlug })
      .populate("categories", "name")
      .select(
        "businessName slug bio businessIcon carauselImages categories businessLocation"
      )
      .lean();

    if (!user) {
      return NextResponse.json(
        { success: false, message: "User not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true, user }, { status: 200 });
  } catch (error) {
    console.error("❌ Error fetching user:", error);
    return NextResponse.json(
      { success: false, message: "Internal server error" },
      { status: 500 }
    );
  }
}
