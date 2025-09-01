import connectDB from "@/lib/db";
import OfferModel from "@/model/siteoffer/user.siteoffer.model";
import { NextResponse } from "next/server";

export async function POST(request) {
  try {
    await connectDB();

    const body = await request.json();
    const { userId } = body;

    if (!userId) {
      return NextResponse.json(
        { success: false, message: "userId is required" },
        { status: 400 }
      );
    }

    // Fetch offer
    const offer = await OfferModel.findOne({ userId }).lean();

    if (!offer) {
      return NextResponse.json(
        { success: false, message: "Offer does not exist" },
        { status: 404 }
      );
    }

    return NextResponse.json(
      { success: true, offer },
      { status: 200 }
    );

  } catch (error) {
    console.error("Error fetching offer:", error);
    return NextResponse.json(
      { success: false, message: "Internal Server Error" },
      { status: 500 }
    );
  }
}
