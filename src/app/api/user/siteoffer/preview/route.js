import connectDB from "@/lib/db";
import OfferModel from "@/model/siteoffer/user.siteoffer.model";
import { NextResponse } from "next/server";

export async function POST(request) {
  try {
    await connectDB();
    const { userId } = await request.json();

    if (!userId) {
      return NextResponse.json(
        { success: false, message: "userId is not found" },
        { status: 400 } // Bad Request
      );
    }

    const offer = await OfferModel.findOne({userId});

    if (!offer) {
      return NextResponse.json(
        { success: false, message: "offer not exist" },
        { status: 404 } // Not Found
      );
    }


    return NextResponse.json(
      { success: true, offer },
      { status: 200 } // OK
    );

  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { success: false, message: "internal server error" },
      { status: 500 }
    );
  }
}
