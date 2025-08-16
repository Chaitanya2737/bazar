import connectDB from "@/lib/db";
import OfferModel from "@/model/siteoffer/user.siteoffer.model";
import UserModel from "@/model/user.model";
import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";
import { authOptions } from "../../auth/[...nextauth]/route";

export async function POST(request) {
  try {
    await connectDB();

    const { userId, title, interval , businessNameName,
      contact , } = await request.json();

    // Check authentication
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json(
        { success: false, message: "User is not authenticated" },
        { status: 401 }
      );
    }

    const sessionUserId = session.user.id;
    if (userId !== sessionUserId) {
      return NextResponse.json(
        {
          success: false,
          message: "User ID does not match session. Unauthorized access.",
        },
        { status: 403 }
      );
    }

    // Calculate dates
    const startDate = new Date();
    const expiryDate = new Date();
    expiryDate.setDate(startDate.getDate() + interval);

    // Create offer
    const offer = await OfferModel.create({
      userId,
      title,
     intervalDays: interval,
      startDate,
      expiryDate,
      businessNameName,
      contact
    });

    // Update user with the offer reference
    await UserModel.findByIdAndUpdate(userId, {
      $push: {
        siteoffer: {
          offerId: offer._id,
          offerStartDate: startDate,
          offerExpiryDate: expiryDate,
        },
      },
    });

    return NextResponse.json(
      { success: true, message: "Offer created successfully" },
      { status: 200 }
    );
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { success: false, message: "Internal server error" },
      { status: 500 }
    );
  }
}
