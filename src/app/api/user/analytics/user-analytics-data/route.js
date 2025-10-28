import { NextResponse } from "next/server";
import { getAnalyticsData } from "@/lib/ga"; // your existing GA function

export async function POST(request) {
  try {
    const body = await request.json();
    const { pathname, interval = "7d" } = body;

    console.log(pathname);

    if (!pathname) {
      return NextResponse.json(
        { error: "Pathname is required" },
        { status: 400 }
      );
    }

    // Validate interval
    if (!["7d", "30d"].includes(interval)) {
      return NextResponse.json(
        { error: "Invalid interval; use '7d' or '30d'" },
        { status: 400 }
      );
    }

    // Normalize pathname (ensure leading /, no double //)
    const normalizedPath = pathname.startsWith("/") ? pathname : `/${pathname}`;

    let analyticsData;
    try {
      // Pass interval to GA function (it handles dates internally)
      analyticsData = await getAnalyticsData(normalizedPath, interval);
    } catch (gaError) {
      console.error(`Google Analytics fetch failed for ${normalizedPath}:`, gaError);
      analyticsData = { totalViews: 0, totalUsers: 0, daily: [] };
    }

    return NextResponse.json({
      pathname: normalizedPath.replace(/^\//, ""), // Return clean pathname
      interval,
      ...analyticsData, // { totalViews, totalUsers, daily }
    }, {
      headers: { "Cache-Control": "public, s-maxage=300" }, // 5min cache for perf
    });
  } catch (err) {
    console.error("Analytics API error:", err);
    return NextResponse.json(
      { error: "Failed to fetch analytics" },
      { status: 500 }
    );
  }
}