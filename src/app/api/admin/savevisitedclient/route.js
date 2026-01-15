import connectDB from "@/lib/db";
import AdminModel from "@/model/admin.model";
import VisitedClient from "@/model/visitedclient/client.model";
import { NextResponse } from "next/server";

export async function POST(request) {
  try {
    await connectDB();

    const { name, phone, ranking, location, adminId, adminName } =
      await request.json();

    if (!name || !phone || !ranking) {
      return NextResponse.json(
        { error: "Name, phone, and ranking are required" },
        { status: 400 }
      );
    }

    if (!adminId) {
      return NextResponse.json(
        { error: "Admin ID is required" },
        { status: 400 }
      );
    }

    // ✅ Convert frontend location → GeoJSON
    let locationData;
    if (location?.lat && location?.lng) {
      locationData = {
        type: "Point",
        coordinates: [location.lng, location.lat], 
      };
    }

    // ✅ Save visit
    const newVisit = new VisitedClient({
      name,
      phone,
      ranking,
      adminId,
      adminName,
      ...(locationData && { location: locationData }),
    });

    await newVisit.save();

    // ✅ Atomic reward update (SAFE)
    await AdminModel.findByIdAndUpdate(
      adminId,
      { $inc: { rewardPoints: 10 } },
      { new: true }
    );

    return NextResponse.json(
      {
        message: "Visit saved successfully!",
        visit: newVisit,
      },
      { status: 201 }
    );
  } catch (err) {
    console.error("POST /visits error:", err);
    return NextResponse.json(
      { error: "Server error" },
      { status: 500 }
    );
  }
}
