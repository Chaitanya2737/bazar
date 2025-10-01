import { NextResponse } from "next/server";
import { getPageViews } from "@/lib/ga";

export async function POST(request) {
  try {
    const { pathname } = await request.json();

    if (!pathname) {
      return NextResponse.json(
        { error: "Pathname is required" },
        { status: 400 }
      );
    }

    // get total views from 2000-01-01 till today
    const views = await getPageViews(pathname);

    return NextResponse.json({ pathname, views });
  } catch (err) {
    console.error("Analytics error:", err);
    return NextResponse.json(
      { error: "Failed to fetch analytics" },
      { status: 500 }
    );
  }
}
