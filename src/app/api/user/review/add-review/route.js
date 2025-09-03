import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import connectDB from "@/lib/db";
import ReviewModel from "@/model/review/review.model";
import UserModel from "@/model/user.model";
import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";

export async function POST(request) {
  try {
    await connectDB();

    const body = await request.json();
    const session = await getServerSession(authOptions);

    if (!session) {
      return NextResponse.json(
        { success: false, message: "User is not authenticated" },
        { status: 401 }
      );
    }

    const { reviews } = body;

    if (!reviews || !Array.isArray(reviews) || reviews.length === 0) {
      return NextResponse.json(
        { success: false, message: "Missing required fields" },
        { status: 400 }
      );
    }

    // Validate each review item
    for (const review of reviews) {
      if (!review.title) {
        return NextResponse.json(
          { success: false, message: "Each review must have at least a title" },
          { status: 400 }
        );
      }
    }

    // ✅ Use authenticated user's ID
    const userID = session.user.id;

    // Ensure user exists
    const userExists = await UserModel.findById(userID);
    if (!userExists) {
      return NextResponse.json(
        { success: false, message: "User not found" },
        { status: 404 }
      );
    }

    // Check if a review doc exists for this user
    let reviewDoc = await ReviewModel.findOne({ userID });

    if (!reviewDoc) {
      // Create new review document
      reviewDoc = await ReviewModel.create({
        userID,
        reviews,
      });

      // ✅ Link review to user (assuming single reference)
      await UserModel.findByIdAndUpdate(
        userID,
        { review: reviewDoc._id },
        { new: true }
      );
    } else {
      // Push new reviews into existing document
      reviewDoc.reviews.push(...reviews);
      await reviewDoc.save();
    }

    return NextResponse.json(
      {
        success: true,
        message: "Review(s) added successfully",
        reviews: reviewDoc.reviews,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error in POST /api/review:", error);
    return NextResponse.json(
      { success: false, message: "Internal server error" },
      { status: 500 }
    );
  }
}
