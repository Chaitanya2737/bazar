import connectDB from '@/lib/db';
import UserModel from '@/model/user.model';
import { NextResponse } from 'next/server';
import { setInterval } from 'timers';

// In-memory cache for failed user attempts
const failedUserCache = {};
const CACHE_TTL = 60 * 60 * 1000; // 1 hour in milliseconds
const MAX_CACHE_SIZE = 100; // Limit the cache size to prevent memory overflow

// Cleanup expired cache periodically (e.g., every minute)
const intervalId = setInterval(cleanExpiredCache, 60 * 1000);

// Cleanup the interval if server is shutting down
process.on('SIGINT', () => {
  clearInterval(intervalId);
  process.exit();
});

export async function POST(request) {
  try {
    // Ensure database connection is established
    await connectDB();

    // Parse the incoming JSON body and handle errors
    let body;
    try {
      body = await request.json();
    } catch (error) {
      return NextResponse.json({ error: 'Invalid JSON format' }, { status: 400 });
    }



    // Check if the user attempt has already failed previously
    const cachedUser = failedUserCache[body.subdomain];
    if (cachedUser) {
      return NextResponse.json({ error: 'User not found (cached)' }, { status: 404 });
    }

    // Find the user in the database using the subdomain
    let finduser;
    try {
      finduser = await UserModel.findOne({ slug: body.subdomain });
    } catch (error) {
      console.error("Error querying the database:", error);
      return NextResponse.json({ error: 'Database query failed' }, { status: 500 });
    }

    if (!finduser) {
      // Cache the failed user subdomain with a timestamp
      storeFailedUserCache(body.subdomain);
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    // Return success message with user data
    return NextResponse.json({
      message: 'Data received successfully',
      data: finduser,
    });

  } catch (error) {
    // Handle any unexpected errors
    console.error('Error processing POST request:', error);
    return NextResponse.json({ error: 'Failed to process request' }, { status: 500 });
  }
}

// Helper function to validate subdomain format (example)
function isValidSubdomain(subdomain) {
  const subdomainUnicodeRegex = /^[\w\u00C0-\u024F\u1E00-\u1EFF\u0370-\u03FF\s-]+$/; // Allows spaces and Unicode characters
  return subdomainUnicodeRegex.test(subdomain);
}



// Store failed user in cache and manage cache size
function storeFailedUserCache(subdomain) {
  if (Object.keys(failedUserCache).length >= MAX_CACHE_SIZE) {
    // If cache size exceeds max limit, remove the oldest cache entry
    const oldestKey = Object.keys(failedUserCache).reduce((oldest, key) => {
      return failedUserCache[key].timestamp < failedUserCache[oldest].timestamp
        ? key
        : oldest;
    });
    delete failedUserCache[oldestKey]; // Remove the oldest entry
  }
  
  failedUserCache[subdomain] = { timestamp: Date.now() };
}

// Cleanup expired cache
function cleanExpiredCache() {
  const now = Date.now();
  let deletedCount = 0;

  for (const [key, value] of Object.entries(failedUserCache)) {
    if (now - value.timestamp > CACHE_TTL) {
      delete failedUserCache[key];
      deletedCount++;
    }
  }

  if (deletedCount > 0) {
    console.log(`Cleaned up ${deletedCount} expired cache entries.`);
  }
}