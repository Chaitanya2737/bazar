import connectDB from "@/lib/db";
import FcmTokenModel from "@/model/fcm.module";
import { NextResponse } from "next/server";

export async function POST(request) {
  try {
    await connectDB();

    const {
      token,
      deviceInfo = "Unknown Device",
      platform = "Unknown Platform",
      appVersion = "Unknown Version",
      location = {},
      city = "Unknown Location",
    } = await request.json();

    if (!token) {
      return NextResponse.json({ msg: "FCM token is required" }, { status: 400 });
    }

    await FcmTokenModel.updateOne(
      { token },
      {
        $set: {
          deviceInfo,
          platform,
          appVersion,
          location: {
            latitude: location?.latitude ?? null,
            longitude: location?.longitude ?? null,
          },
          city,
        },
      },
      { upsert: true }
    );

    return NextResponse.json({ msg: "Token info saved successfully" }, { status: 200 });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ msg: "Internal Server Error" }, { status: 500 });
  }
}
