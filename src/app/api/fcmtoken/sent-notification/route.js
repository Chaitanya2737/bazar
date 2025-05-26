import connectDB from "@/lib/db";
import { admin } from "@/lib/firebase-admin";
import FcmTokenModel from "@/model/fcm.module";

// Helper to clean and validate tokens
function cleanAndValidateToken(token) {
  if (typeof token !== "string") return null;

  const cleaned = token.trim();

  // Basic validation, customize as needed
  if (cleaned.length < 100 || cleaned.includes(" ")) {
    return null;
  }

  return cleaned;
}

// Helper to remove invalid tokens after sending notifications
async function removeInvalidTokens(response, registrationTokens) {
  const tokensToRemove = [];

  response.responses.forEach((resp, idx) => {
    if (!resp.success && resp.error.code === "messaging/registration-token-not-registered") {
      tokensToRemove.push(registrationTokens[idx]);
    }
  });

  if (tokensToRemove.length > 0) {
    console.log("Removing invalid tokens:", tokensToRemove);
    await FcmTokenModel.deleteMany({ token: { $in: tokensToRemove } });
  }
}

export async function GET() {
  try {
    await connectDB();

    const tokens = await FcmTokenModel.find();
    if (!tokens || tokens.length === 0) {
      return new Response(
        JSON.stringify({ message: "No tokens found" }),
        {
          status: 404,
          headers: { "Content-Type": "application/json" },
        }
      );
    }

    // Clean and validate tokens before sending
    const registrationTokens = tokens
      .map((t) => cleanAndValidateToken(t.token))
      .filter(Boolean);

    if (registrationTokens.length === 0) {
      return new Response(
        JSON.stringify({ message: "No valid tokens found" }),
        {
          status: 404,
          headers: { "Content-Type": "application/json" },
        }
      );
    }

    const message = {
      notification: {
        title: "Hello from Server!",
        body: "This is a test notification.",
      },
      tokens: registrationTokens,
    };

      const response = await admin.messaging().sendEachForMulticast(message);
  

    // Remove invalid tokens from DB
    await removeInvalidTokens(response, registrationTokens);

    return new Response(
      JSON.stringify({
        successCount: response.successCount,
        failureCount: response.failureCount,
        responses: response.responses,
        // removedTokens: response.responses
        //   .map((resp, idx) =>
        //     !resp.success && resp.error.code === "messaging/registration-token-not-registered"
        //       ? registrationTokens[idx]
        //       : null
        //   )
        //   .filter(Boolean),
        message: "Notifications sent successfully",
      }),
      {
        status: 200,
        headers: { "Content-Type": "application/json" },
      }
    );
  } catch (error) {
    console.error("FCM Error:", error);
    return new Response(
      JSON.stringify({ message: "Failed to send notifications", error: error.message }),
      {
        status: 500,
        headers: { "Content-Type": "application/json" },
      }
    );
  }
}
