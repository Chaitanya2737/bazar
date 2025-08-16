import connectDB from "@/lib/db";
import OfferModel from "@/model/siteoffer/user.siteoffer.model";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    await connectDB();

    const now = new Date();

    // Delete expired offers
    await OfferModel.deleteMany({ expiryDate: { $lt: now } });

    // Get remaining offers
    const offers = await OfferModel.find().lean();

    if (offers.length === 0) {
      return NextResponse.json({ message: "No offers found", offers: [] });
    }

    return NextResponse.json({ offers });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
