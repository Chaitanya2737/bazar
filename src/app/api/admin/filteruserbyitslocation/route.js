import connectDB from "@/lib/db";
import VisitedClient from "@/model/visitedclient/client.model";
import { NextResponse } from "next/server";

export async function POST(request) {
  try {
    await connectDB();

    const body = await request.json();
    let { lat, lng, page = 1, limit = 10 } = body; 

    // ✅ Convert string → number
    lat = Number(lat);
    lng = Number(lng);
    page = Number(page);
    limit = Number(limit);

    // ❌ Basic validation
    if (isNaN(lat) || isNaN(lng)) {
      return NextResponse.json(
        { success: false, message: "Latitude or Longitude is invalid" },
        { status: 400 }
      );
    }

    // ❌ Range validation
    if (lat < -90 || lat > 90 || lng < -180 || lng > 180) {
      return NextResponse.json(
        {
          success: false,
          message: "Latitude or Longitude out of bounds",
        },
        { status: 400 }
      );
    }

    // ⚠️ India safety check (optional but recommended)
    if (lat > 40 || lat < 5 || lng < 60 || lng > 100) {
      console.warn("⚠️ Suspicious coordinates:", { lat, lng });
    }

    const distanceKm = 150;
    const skip = (page - 1) * limit;

    // ✅ total count (for pagination UI)
    // ✅ total count (pagination-safe)
    const total = await VisitedClient.countDocuments({
      location: {
        $geoWithin: {
          $centerSphere: [
            [lng, lat],
            distanceKm / 6378.1, // radius in radians
          ],
        },
      },
    });

    const usersNearby = await VisitedClient.find({
      location: {
        $near: {
          $geometry: {
            type: "Point",
            coordinates: [lng, lat],
          },
          $maxDistance: distanceKm * 1000,
        },
      },
    })
      .skip(skip) // ✅ added
      .limit(limit) // ✅ replaced hard 100
      .lean();

    if (!usersNearby.length) {
      return NextResponse.json({
        success: true,
        count: 0,
        data: [],
        pagination: {
          total,
          page,
          limit,
          totalPages: Math.ceil(total / limit),
        },
        message: `No users found within ${distanceKm} km`,
      });
    }

    return NextResponse.json({
      success: true,
      count: usersNearby.length,
      data: usersNearby,
      pagination: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
      message: "Nearby users fetched successfully",
    });
  } catch (error) {
    console.error("Nearby users API error:", error);

    return NextResponse.json(
      { success: false, message: "Internal Server Error" },
      { status: 500 }
    );
  }
}
