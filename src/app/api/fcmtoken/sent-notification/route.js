import connectDB from "@/lib/db";
import { admin } from "@/lib/firebase-admin";
import FcmTokenModel from "@/model/fcm.module";

// Utility functions remain the same
const cleanInvalidTokens = async (invalidTokens) => {
  if (invalidTokens.length === 0) return;
  await FcmTokenModel.deleteMany({ token: { $in: invalidTokens } });
  console.log(`Cleaned ${invalidTokens.length} invalid tokens`);
};

const sendBatchNotifications = async (tokens, payload) => {
  const BATCH_SIZE = 500;
  const results = [];

  for (let i = 0; i < tokens.length; i += BATCH_SIZE) {
    const batch = tokens.slice(i, i + BATCH_SIZE);
    try {
      const response = await admin.messaging().sendEachForMulticast({
        tokens: batch,
        data: payload,
       android: {
          priority: "high",
          collapseKey: "general_notification", // Add collapse key
          ttl: 3600 , // 1 hour lifespan
          notification: {
            icon: "ic_notification",
            color: "#FF0000"
          }
        },
        apns: {
          headers: {
            "apns-priority": "10",
            "apns-collapse-id": "general_notification" // iOS collapse key
          }
        },
        webpush: {
          headers: { Urgency: "high" }
        }
      });

      response.responses.forEach((resp, idx) => {
        results.push({
          token: batch[idx],
          success: resp.success,
          error: resp.error
        });
      });
    } catch (error) {
      batch.forEach(token => {
        results.push({ token, success: false, error });
      });
    }
  }
  return results;
};

export async function GET(request) {
  try {
    await connectDB();

    // Get query parameters (if needed)
    const { searchParams } = new URL(request.url);
    const userIds = searchParams.get('userIds')?.split(',') || [];

    // Get tokens
    const query = userIds.length > 0 ? { user: { $in: userIds } } : {};
    const tokens = await FcmTokenModel.distinct("token", query);

    if (tokens.length === 0) {
      return new Response(
        JSON.stringify({ success: false, message: "No active devices found" }),
        { status: 404, headers: { "Content-Type": "application/json" } }
      );
    }

    // Notification payload (now hardcoded for GET)
    const payload = {
      title: "तुमचा सहयेगी | Your Partner",
      // body: "लहान व्यवसायासाठी खास व्यासपीठ...",
      image:"https://res.cloudinary.com/dp8evydam/image/upload/v1748282798/ChatGPT_Image_May_26_2025_11_33_32_PM_eckicl.png",
      click_action: "https://bazar-tau-eight.vercel.app/",
      actions: JSON.stringify([
        { action: "open_url", title: "Open Website" },
        { action: "dismiss", title: "Dismiss" },
        { action: "unsubscribe", title: "Unsubscribe" }
      ])
    };

    // Send notifications
    const results = await sendBatchNotifications(tokens, payload);
    const invalidTokens = results
      .filter(r => !r.success && r.error?.code === "messaging/registration-token-not-registered")
      .map(r => r.token);

    await cleanInvalidTokens(invalidTokens);

    return new Response(
      JSON.stringify({
        success: true,
        sent: results.filter(r => r.success).length,
        failed: results.filter(r => !r.success).length
      }),
      { status: 200, headers: { "Content-Type": "application/json" } }
    );

  } catch (error) {
    console.error("Notification error:", error);
    return new Response(
      JSON.stringify({
        success: false,
        message: "Failed to send notifications"
      }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
}