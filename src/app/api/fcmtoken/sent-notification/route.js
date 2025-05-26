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
    if (
      !resp.success &&
      resp.error.code === "messaging/registration-token-not-registered"
    ) {
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
      return new Response(JSON.stringify({ message: "No tokens found" }), {
        status: 404,
        headers: { "Content-Type": "application/json" },
      });
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
        title: "व्यवसाय वाढीसाठी तुमचा विश्वासू भागीदार!",
        body: `तुमच्या स्टार्टअपसाठी व्यवसाय हब – तुमच्या यशाचा पाया!
लहान व्यवसाय, नव्या संधींसाठी आम्ही तयार केले आहे खास तुमच्यासाठी एक व्यासपीठ.
तुमच्या स्टार्टअपसाठी पूर्ण मार्गदर्शन, सल्ला, आणि वेबसाइट डिझाइनपासून मार्केटिंगपर्यंत सर्व काही एका ठिकाणी!

आम्ही काय देतो?

व्यवसायाला नवे आयाम देणारे वेबसाईट डिझाइन

मोबाईल आणि डेस्कटॉपसाठी सुसंगत आणि आकर्षक वेबसाइट्स

शेगाने विकसित होणारे डिजिटल मार्केटिंग सोल्यूशन्स

सुलभ व्यवस्थापन आणि सतत सहकार्य

तुमच्या व्यवसायासाठी योग्य मार्गदर्शन आणि तंत्रज्ञानाचा वापर

तयार आहात का तुमच्या व्यवसायाला पुढे न्यायला?
आमच्याशी संपर्क साधा आणि तुमच्या यशाच्या प्रवासाला सुरुवात करा!

`,
      },
      tokens: registrationTokens,
       image: "https://res.cloudinary.com/dp8evydam/image/upload/v1748282798/ChatGPT_Image_May_26_2025_11_33_32_PM_eckicl.png"
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
      JSON.stringify({
        message: "Failed to send notifications",
        error: error.message,
      }),
      {
        status: 500,
        headers: { "Content-Type": "application/json" },
      }
    );
  }
}
