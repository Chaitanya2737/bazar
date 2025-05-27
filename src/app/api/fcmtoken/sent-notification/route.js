import connectDB from "@/lib/db";
import { admin } from "@/lib/firebase-admin";
import FcmTokenModel from "@/model/fcm.module";

const removeInvalidTokens = async (responses, tokens) => {
  const tokensToRemove = responses
    .map((resp, idx) =>
      !resp.success &&
      resp.error?.code === "messaging/registration-token-not-registered"
        ? tokens[idx]
        : null
    )
    .filter(Boolean);

  if (tokensToRemove.length) {
    console.log("Cleaning invalid tokens:", tokensToRemove.length);
    await FcmTokenModel.deleteMany({ token: { $in: tokensToRemove } });
  }
};

const sendMessagesIndividually = async (tokens, data) => {
  const responses = [];

  for (const token of tokens) {
    try {
      const message = { token, data };
      await admin.messaging().send(message);
      responses.push({ success: true });
    } catch (error) {
      responses.push({ success: false, error });
    }
  }

  return responses;
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

    const data = {
      title: "तुमचा सहयेगी",
      body: "लहान व्यवसायासाठी खास व्यासपीठ...",
      image:
        "https://res.cloudinary.com/dp8evydam/image/upload/v1748282798/ChatGPT_Image_May_26_2025_11_33_32_PM_eckicl.png",
      click_action: "https://bazar-tau-eight.vercel.app/",
      actions: JSON.stringify([
        { action: "open_url", title: "Open Website" },
        { action: "dismiss", title: "Dismiss" },
        { action: "unsubscribe", title: "Unsubscribe" },
      ]),
    };

    const responses = await sendMessagesIndividually(
      registrationTokens,
      data
    );

    await removeInvalidTokens(responses, registrationTokens);

    const successCount = responses.filter((r) => r.success).length;
    const failureCount = responses.length - successCount;

    return new Response(
      JSON.stringify({
        successCount,
        failureCount,
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
