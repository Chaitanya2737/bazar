import { NextResponse } from "next/server";
import { getPageViews, getEventCount } from "@/lib/ga";

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const slug = searchParams.get("slug") || "/";
    const eventName = searchParams.get("event");

    if (eventName) {
      const count = await getEventCount(eventName);
      return NextResponse.json({ event: eventName, count });
    }

    const views = await getPageViews(slug);
    return NextResponse.json({ slug, views });
  } catch (err) {
    console.error("Analytics error:", err);
    return NextResponse.json(
      { error: "Failed to fetch analytics" },
      { status: 500 }
    );
  }
}
