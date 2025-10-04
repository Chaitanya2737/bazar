import { NextResponse } from "next/server";
import { getAnalyticsData } from "@/lib/ga";

export async function POST(request) {
  try {
    if (request.method !== "POST") {
      return NextResponse.json(
        { error: "Method not allowed" },
        { status: 405 }
      );
    }

    const { pathname } = await request.json();

    if (!pathname) {
      return NextResponse.json(
        { error: "Pathname is required" },
        { status: 400 }
      );
    }

    // Fetch GA analytics safely
    let views = 0;
    try {
      views = await getAnalyticsData(`/${pathname}`);
    } catch (gaError) {
      console.error("Google Analytics fetch failed:", gaError);
      // fallback to 0 if GA fails
      views = 0;
    }

    return NextResponse.json({ pathname, views });
  } catch (err) {
    console.error("Analytics API error:", err);
    return NextResponse.json(
      { error: "Failed to fetch analytics" },
      { status: 500 }
    );
  }
}
