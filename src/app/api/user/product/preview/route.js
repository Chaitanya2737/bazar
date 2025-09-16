import connectDB from "@/lib/db";
import UserProductModel from "@/model/product/user.product.model";
import { NextResponse } from "next/server";

// Simple in-memory cache object
const cache = new Map();
const CACHE_DURATION = 3 * 60 * 60 * 1000; // 3 hours in ms

export const POST = async (request) => {
  try {
    await connectDB();
    const { id: userId } = await request.json();

    if (!userId) {
      return NextResponse.json(
        { success: false, message: "User ID is required" },
        { status: 400 }
      );
    }

    // Check cache
    const cached = cache.get(userId);
    const now = Date.now();

    if (cached && now - cached.timestamp < CACHE_DURATION) {
      return NextResponse.json(
        { success: true, products: cached.data, cached: true },
        { status: 200 }
      );
    }

    // Fetch fresh data
    const products = await UserProductModel.find({ userId });

    if (!products.length) {
      return NextResponse.json(
        { success: false, message: "No products found" },
        { status: 404 }
      );
    }

    // Store in cache
    cache.set(userId, {
      data: products,
      timestamp: now,
    });

    return NextResponse.json(
      { success: true, products, cached: false },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error fetching user products:", error);
    return NextResponse.json(
      { success: false, message: "Internal server error" },
      { status: 500 }
    );
  }
};
