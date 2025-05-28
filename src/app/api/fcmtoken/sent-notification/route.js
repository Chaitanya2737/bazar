import connectDB from "@/lib/db";
import { admin } from "@/lib/firebase-admin";
import FcmTokenModel from "@/model/fcm.module";

const BATCH_SIZE = 500;

// Clean invalid tokens from DB
async function cleanInvalidTokens(invalidTokens) {
  if (invalidTokens.length === 0) return;
  try {
    const res = await FcmTokenModel.deleteMany({ token: { $in: invalidTokens } });
    console.log(`[FCM] Cleaned ${invalidTokens.length} invalid tokens`);
    return res;
  } catch (error) {
    console.error("[FCM] Failed to clean invalid tokens:", error);
  }
}

// Send notifications in batches with retry for transient errors
async function sendBatchNotifications(tokens, payload, maxRetries = 3) {
  const results = [];
  
  for (let i = 0; i < tokens.length; i += BATCH_SIZE) {
    const batch = tokens.slice(i, i + BATCH_SIZE);
    let attempt = 0;
    let response = null;
    let error = null;
    
    while (attempt < maxRetries) {
      try {
        response = await admin.messaging().sendEachForMulticast({
          tokens: batch,
          notification: payload.notification,
          data: payload.data,
          android: payload.androidOptions,
          apns: payload.apnsOptions,
          webpush: payload.webpushOptions,
        });
        break; // Success
      } catch (err) {
        error = err;
        attempt++;
        console.warn(`[FCM] Attempt ${attempt} failed for batch ${i}-${i + batch.length}:`, err.message);
        if (attempt >= maxRetries) {
          console.error(`[FCM] Max retries reached for batch ${i}-${i + batch.length}`);
        }
        await new Promise(res => setTimeout(res, 1000 * attempt)); // Exponential backoff
      }
    }

    if (response) {
      response.responses.forEach((resp, idx) => {
        results.push({
          token: batch[idx],
          success: resp.success,
          error: resp.error || null,
        });
      });
    } else {
      // All attempts failed, mark all tokens in batch as failed
      batch.forEach(token => {
        results.push({ token, success: false, error });
      });
    }
  }
  return results;
}

export async function GET(request) {
  try {
    await connectDB();

    const { searchParams } = new URL(request.url);
    const userIds = searchParams.get("userIds")?.split(",") || [];

    // Fetch tokens for specified users or all tokens if none specified
    const query = userIds.length > 0 ? { user: { $in: userIds } } : {};
    const tokens = await FcmTokenModel.distinct("token", query);

    if (tokens.length === 0) {
      return new Response(
        JSON.stringify({ success: false, message: "No active devices found" }),
        { status: 404, headers: { "Content-Type": "application/json" } }
      );
    }

    // Dynamic payload with customizable notification and data fields
    const payload = {
      notification: {
        title: "तुमचा सहयेगी | Your Partner",
        body: "लहान व्यवसायासाठी खास व्यासपीठ...",
        image:
          "https://res.cloudinary.com/dp8evydam/image/upload/v1748282798/ChatGPT_Image_May_26_2025_11_33_32_PM_eckicl.png",
        click_action: "https://bazar-tau-eight.vercel.app/",
        icon: "ic_notification", // Android & web icon
        color: "#FF0000",
        sound: "default",
        badge: "1",
      },
      data: {
        click_action: "https://bazar-tau-eight.vercel.app/",
        actions: JSON.stringify([
          { action: "open_url", title: "Open Website" },
          { action: "dismiss", title: "Dismiss" },
          { action: "unsubscribe", title: "Unsubscribe" },
        ]),
        type: "general_notification",
        timestamp: Date.now().toString(),
        customKey1: "customValue1",
        customKey2: "customValue2",
      },
      androidOptions: {
        priority: "high",
        collapseKey: "general_notification",
        ttl: 3600, // 1 hour in seconds
        notification: {
          icon: "ic_notification",
          color: "#FF0000",
          sound: "default",
          clickAction: "https://bazar-tau-eight.vercel.app/",
        },
      },
      apnsOptions: {
        headers: {
          "apns-priority": "10",
          "apns-collapse-id": "general_notification",
        },
        payload: {
          aps: {
            badge: 1,
            sound: "default",
            category: "GENERAL_CATEGORY",
          },
        },
      },
      webpushOptions: {
        headers: { Urgency: "high" },
        notification: {
          icon: "https://example.com/icons/notification-icon.png",
          badge: "https://example.com/icons/badge-icon.png",
          renotify: true,
          requireInteraction: true,
        },
      },
    };

    // Send notifications and get results
    const results = await sendBatchNotifications(tokens, payload);

    // Filter invalid tokens to delete
    const invalidTokens = results
      .filter((r) => !r.success && r.error?.code === "messaging/registration-token-not-registered")
      .map((r) => r.token);

    await cleanInvalidTokens(invalidTokens);

    return new Response(
      JSON.stringify({
        success: true,
        totalTokens: tokens.length,
        sent: results.filter((r) => r.success).length,
        failed: results.filter((r) => !r.success).length,
        invalidTokensRemoved: invalidTokens.length,
      }),
      { status: 200, headers: { "Content-Type": "application/json" } }
    );
  } catch (error) {
    console.error("[FCM] Notification error:", error);
    return new Response(
      JSON.stringify({
        success: false,
        message: "Failed to send notifications",
        error: error.message || error.toString(),
      }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
}
