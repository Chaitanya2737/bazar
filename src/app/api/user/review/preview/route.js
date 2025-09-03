import connectDB from "@/lib/db";
import ReviewModel from "@/model/review/review.model";
import mongoose from "mongoose";
import { NextResponse } from "next/server";

export async function POST(request) {
  try {
    await connectDB();

    const { ReviewId } = await request.json();

    console.log("Received ReviewId:", ReviewId);

    if (!ReviewId) {
      return NextResponse.json(
        { success: false, message: "ReviewId is required" },
        { status: 400 }
      );
    }

    // Convert to ObjectId
    if (!mongoose.Types.ObjectId.isValid(ReviewId)) {
      return NextResponse.json(
        { success: false, message: "Invalid ReviewId" },
        { status: 400 }
      );
    }

    const review = await ReviewModel.findById(ReviewId).lean();

    if (!review) {
      return NextResponse.json(
        { success: false, message: "No review found" },
        { status: 404 }
      );
    }

    return NextResponse.json(
      {
        success: true,
        review,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("❌ Error fetching review:", error);
    return NextResponse.json(
      { success: false, message: "Internal server error" },
      { status: 500 }
    );
  }
}
