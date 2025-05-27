import connectDB from "@/lib/db";
import { admin } from "@/lib/firebase-admin";
import FcmTokenModel from "@/model/fcm.module";

const removeInvalidTokens = async (responses, tokens) => {
  const tokensToRemove = responses
    .map((resp, idx) =>
      !resp.success &&
      resp.error.code === "messaging/registration-token-not-registered"
        ? tokens[idx]
        : null
    )
    .filter(Boolean);

  if (tokensToRemove.length) {
    console.log("Cleaning invalid tokens:", tokensToRemove.length);
    await FcmTokenModel.deleteMany({ token: { $in: tokensToRemove } });
  }
};

export async function GET() {
  try {
    await connectDB();

    const tokenDocs = await FcmTokenModel.find({}, "token").lean();
    if (!tokenDocs.length) {
      return new Response(JSON.stringify({ message: "No tokens found" }), {
        status: 404,
        headers: { "Content-Type": "application/json" },
      });
    }

    const registrationTokens = [...new Set(tokenDocs.map((doc) => doc.token))];

    if (!registrationTokens.length) {
      return new Response(
        JSON.stringify({ message: "No valid tokens available" }),
        {
          status: 404,
          headers: { "Content-Type": "application/json" },
        }
      );
    }

    const message = {
      notification: {
        title: "व्यवसाय वाढीसाठी तुमचा विश्वासू भागीदार!",
        image:
          "https://res.cloudinary.com/dp8evydam/image/upload/v1748282798/ChatGPT_Image_May_26_2025_11_33_32_PM_eckicl.png",
       
      },
        data: {
    url: "https://your-landing-page.com",
    actions: JSON.stringify([
      { action: "open_url", title: "Open Website" },
      { action: "dismiss", title: "Dismiss" }
    ]),
  },
      tokens: registrationTokens,
    };

    const response = await admin.messaging().sendEachForMulticast(message);
    await removeInvalidTokens(response.responses, registrationTokens);

    return new Response(
      JSON.stringify({
        successCount: response.successCount,
        failureCount: response.failureCount,
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
      JSON.stringify({
        message: "Failed to send notifications",
        error: error.message || "Unknown error",
      }),
      {
        status: 500,
        headers: { "Content-Type": "application/json" },
      }
    );
  }
}
