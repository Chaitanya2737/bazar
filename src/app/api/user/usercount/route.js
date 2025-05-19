import connectDB from "@/lib/db";
import UserModel from "@/model/user.model";
import { NextResponse } from "next/server";

// In-memory cache using Map
const cache = new Map();

// Cache expiration time (1 day in milliseconds)
const CACHE_TTL = 60000  ; // 1 day
// 60000 * 60 * 24
// Utility function to check if cache is expired
function isCacheExpired(userId) {
  const cacheEntry = cache.get(userId);
  if (!cacheEntry) return true;
  return Date.now() - cacheEntry.timestamp > CACHE_TTL;
}

// Set cache with timestamp
function setCache(userId, visitCount) {
  cache.set(userId, {
    visitCount,
    timestamp: Date.now(),
  });
}

// Acquire lock for cache updates (optional, prevents race conditions)
const cacheLocks = new Map();

async function acquireLock(userId) {
  if (!cacheLocks.get(userId)) {
    cacheLocks.set(userId, Promise.resolve());
  }
  const currentLock = cacheLocks.get(userId);
  const newLock = new Promise((resolve) => currentLock.finally(resolve));
  cacheLocks.set(userId, newLock);
  await newLock;
}

function releaseLock(userId) {
  cacheLocks.delete(userId);
}

export async function POST(request) {
  try {
    await connectDB();
    const { userId } = await request.json();

    if (!userId) {
      return NextResponse.json({ error: "userId is required" }, { status: 400 });
    }

    const cachedEntry = cache.get(userId);

    // If cache exists and not expired
    if (cachedEntry && !isCacheExpired(userId)) {
      cachedEntry.visitCount += 1; // Increment visit count
      cachedEntry.timestamp = Date.now();
      cache.set(userId, cachedEntry);

      return NextResponse.json(
        { visitCount: cachedEntry.visitCount, message: "Cache hit" },
        { status: 200 }
      );
    }

    // Acquire lock to prevent concurrent updates
    await acquireLock(userId);

    // Fetch the current user data from the DB to get the latest visitCount
    const user = await UserModel.findById(userId);

    // If no user found, release the lock and return error
    if (!user) {
      releaseLock(userId);
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // If cached entry exists but is expired, save that data to the database
    if (cachedEntry && isCacheExpired(userId)) {
      await UserModel.findByIdAndUpdate(
        userId,
        { $inc: { visitCount: cachedEntry.visitCount } },
        { upsert: true }
      );
    }

    // Update visitCount by setting the new value (not incrementing by 1)
    const updatedUser = await UserModel.findByIdAndUpdate(
      userId,
      { visitCount: (user.visitCount || 0) + 1 }, // Set visitCount explicitly
      { new: true, upsert: true }
    );

    // Set new cache entry
    setCache(userId, updatedUser.visitCount);

    releaseLock(userId);

    return NextResponse.json(
      { visitCount: updatedUser.visitCount, message: "DB update" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error:", error);
    return NextResponse.json(
      { error: "Server error" },
      { status: 500 }
    );
  }
}
