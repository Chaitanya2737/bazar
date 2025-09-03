import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import connectDB from "@/lib/db";
import UserProductModel from "@/model/product/user.product.model";
import ReviewModel from "@/model/review/review.model";
import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";

export const DELETE = async (request) => {
  try {
    await connectDB();

    const { reviewID, itemID } = await request.json();

    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json(
        { success: false, message: "User is not authenticated" },
        { status: 401 }
      );
    }

    // ✅ Remove itemID from the review document
    const updatedReview = await ReviewModel.findByIdAndUpdate(
      reviewID,
      { $pull: { reviews: { _id: itemID } } },
      { new: true }
    );

    if (!updatedReview) {
      console.log("❌ Review not found for ID:", itemID);
      return NextResponse.json(
        { success: false, message: "Review not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(
      {
        success: true,
        message: "Item removed successfully",
        data: updatedReview,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("❌ Error deleting item:", error);
    return NextResponse.json(
      { success: false, message: "Internal server error" },
      { status: 500 }
    );
  }
};
