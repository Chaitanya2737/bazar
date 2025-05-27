import connectDB from "@/lib/db";
import { admin } from "@/lib/firebase-admin";
import FcmTokenModel from "@/model/fcm.module";

// Utility function to clean invalid tokens
const removeInvalidTokens = async (responses, tokens) => {
  const invalidTokens = responses
    .filter(resp => !resp.success && resp.error?.code === "messaging/registration-token-not-registered")
    .map((_, idx) => tokens[idx]);

  if (invalidTokens.length > 0) {
    console.log(`Removing ${invalidTokens.length} invalid tokens`);
    await FcmTokenModel.deleteMany({ token: { $in: invalidTokens } });
  }
};

// Send messages with batch processing
const sendMessages = async (tokens, message) => {
  const batchSize = 500; // FCM allows up to 500 tokens per batch
  const results = [];

  for (let i = 0; i < tokens.length; i += batchSize) {
    const batch = tokens.slice(i, i + batchSize);
    
    try {
      // Send multicast message to the batch
      const response = await admin.messaging().sendEachForMulticast({
        tokens: batch,
        data: message,
        android: { priority: "high" },
        apns: { headers: { "apns-priority": "10" } }
      });

      // Process response
      response.responses.forEach((resp, idx) => {
        results.push({
          success: resp.success,
          error: resp.error,
          token: batch[idx]
        });
      });

      console.log(`Batch ${i / batchSize + 1} completed: ${response.successCount} successful`);
    } catch (error) {
      console.error(`Error in batch ${i / batchSize + 1}:`, error);
      batch.forEach(token => {
        results.push({
          success: false,
          error,
          token
        });
      });
    }
  }

  return results;
};

export async function GET() {
  try {
    await connectDB();

    // Get unique tokens from database
    const tokenDocs = await FcmTokenModel.find({}, "token").lean();
    const registrationTokens = [...new Set(tokenDocs.map(doc => doc.token))];

    if (registrationTokens.length === 0) {
      return new Response(
        JSON.stringify({ message: "No valid tokens available" }),
        { status: 404, headers: { "Content-Type": "application/json" } }
      );
    }

    // Notification payload
    const message = {
      title: "तुमचा सहयेगी",
      body: "लहान व्यवसायासाठी खास व्यासपीठ...",
      image: "https://res.cloudinary.com/dp8evydam/image/upload/v1748282798/ChatGPT_Image_May_26_2025_11_33_32_PM_eckicl.png",
      click_action: "https://bazar-tau-eight.vercel.app/",
      actions: JSON.stringify([
        { action: "open_url", title: "Open Website" },
        { action: "dismiss", title: "Dismiss" },
        { action: "unsubscribe", title: "Unsubscribe" }
      ]),
      // Additional metadata
      timestamp: new Date().toISOString(),
      priority: "high"
    };

    // Send notifications
    const startTime = Date.now();
    const responses = await sendMessages(registrationTokens, message);
    const duration = Date.now() - startTime;

    // Clean invalid tokens
    await removeInvalidTokens(responses, registrationTokens);

    // Calculate results
    const successCount = responses.filter(r => r.success).length;
    const failureCount = responses.length - successCount;

    return new Response(
      JSON.stringify({
        successCount,
        failureCount,
        totalTokens: registrationTokens.length,
        duration: `${duration}ms`,
        message: "Notifications processed"
      }),
      { status: 200, headers: { "Content-Type": "application/json" } }
    );

  } catch (error) {
    console.error("FCM Error:", error);
    return new Response(
      JSON.stringify({
        message: "Failed to send notifications",
        error: error.message || "Unknown error",
        stack: process.env.NODE_ENV === "development" ? error.stack : undefined
      }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
}