import connectDB from "@/lib/db";
import UserProductModel from "@/model/product/user.product.model";
import { NextResponse } from "next/server";

// Shared in-memory cache
export const cache = new Map();
const CACHE_DURATION = 3 * 60 * 60 * 1000; // 3 hours in ms

// Helper to fetch fresh data and update cache
export const updateCacheForUser = async (userId) => {
  const products = await UserProductModel.find({ userId });
  cache.set(userId, { data: products, timestamp: Date.now() });
  return products;
};

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

    const cached = cache.get(userId);
    const now = Date.now();

    // If cache exists and is valid, serve it immediately
    if (cached && now - cached.timestamp < CACHE_DURATION) {
      const response = NextResponse.json(
        { success: true, products: cached.data, cached: true },
        { status: 200 }
      );

      // Refresh cache asynchronously in the background
      updateCacheForUser(userId).catch((err) =>
        console.error("Error refreshing cache:", err)
      );

      return response;
    }

    // No cache or expired → fetch fresh from DB
    const products = await updateCacheForUser(userId);

    if (!products.length) {
      return NextResponse.json(
        { success: false, message: "No products found" },
        { status: 404 }
      );
    }

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
