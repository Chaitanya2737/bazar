import connectDB from "@/lib/db";
import { admin } from "@/lib/firebase-admin";
import FcmTokenModel from "@/model/fcm.module";

// Clean invalid tokens from DB
const cleanInvalidTokens = async (invalidTokens) => {
  if (!invalidTokens?.length) return;
  try {
    const result = await FcmTokenModel.deleteMany({ token: { $in: invalidTokens } });
    console.log(`Cleaned ${result.deletedCount} invalid tokens`);
  } catch (error) {
    console.error("Error cleaning invalid tokens:", error);
  }
};

// Send notifications in batches to tokens
const sendBatchNotifications = async (tokens, payload) => {
  const BATCH_SIZE = 500;
  const results = [];
  const invalidTokens = [];

  for (let i = 0; i < tokens.length; i += BATCH_SIZE) {
    const batch = tokens.slice(i, i + BATCH_SIZE);
    try {
      const response = await admin.messaging().sendEachForMulticast({
        tokens: batch,
        ...payload,
        android: {
          priority: "high",
          collapseKey: "general_notification",
          ttl: 3600,
          notification: {
            icon: "ic_notification",
            color: "#FF0000",
            ...payload.notification,
          },
        },
        apns: {
          headers: {
            "apns-priority": "10",
            "apns-collapse-id": "general_notification",
          },
          payload: {
            aps: {
              alert: {
                title: payload.notification?.title,
                body: payload.notification?.body,
              },
              "mutable-content": 1,
            },
          },
        },
        webpush: {
          headers: { Urgency: "high" },
          notification: {
            ...payload.notification,
            actions: payload.data?.actions ? JSON.parse(payload.data.actions) : [],
          },
        },
      });

      response.responses.forEach((resp, idx) => {
        if (!resp.success && resp.error?.code === "messaging/registration-token-not-registered") {
          invalidTokens.push(batch[idx]);
        }
        results.push({
          token: batch[idx],
          success: resp.success,
          error: resp.error,
        });
      });
    } catch (error) {
      console.error(`Batch ${i}-${i + BATCH_SIZE} failed:`, error);
      batch.forEach((token) => {
        results.push({ token, success: false, error });
      });
    }
  }

  if (invalidTokens.length) {
    await cleanInvalidTokens(invalidTokens);
  }
  return results;
};

// Marathi notification templates
// Notification templates
 const marathiNotifications = [
    {
      title: "तुमचा व्यवसाय ऑनलाइन घ्या!",
      body: "डिजिटल मार्केटिंगसह ग्राहकांपर्यंत सहज पोहोचा! तेही मोफत सुरूवात!",
      image: "https://res.cloudinary.com/dp8evydam/image/upload/v1748449189/Giggling_Platypus_Co._1_jl9gj3.png",
      click_action: "https://yourhub.com/start-now",
      actions: [
        { action: "start_now", title: "आजच सुरू करा" },
        { action: "dismiss", title: "नंतर" }
      ]
    },
    {
      title: "१० मिनिटांत तुमची पहिली जाहिरात तयार करा",
      body: "टेम्प्लेट वापरा आणि सोशल मीडियावर पोस्ट करा – तांत्रिक ज्ञान न लागता!",
      image: "https://res.cloudinary.com/dp8evydam/image/upload/v1748282798/ChatGPT_Image_May_26_2025_11_33_32_PM_eckicl.png",
      click_action: "https://yourhub.com/create-ad",
      actions: [
        { action: "create_ad", title: "जाहिरात तयार करा" },
        { action: "dismiss", title: "नंतर" }
      ]
    },
    {
      title: "तुमचा व्यवसाय किती वाढला? बघा अहवाल",
      body: "महिन्याचा संपूर्ण अहवाल – पोहोच, क्लिक्स, आणि जाहिरात परिणाम.",
      image: "https://res.cloudinary.com/dp8evydam/image/upload/v1748449189/Giggling_Platypus_Co._1_jl9gj3.png",
      click_action: "https://yourhub.com/my-report",
      actions: [
        { action: "view_report", title: "अहवाल पहा" },
        { action: "dismiss", title: "बंद करा" }
      ]
    },
    {
      title: "नवीन टूल्स उपलब्ध!",
      body: "सोशल मीडिया व्यवस्थापनासाठी आमची नवीन साधने वापरा – वेळ आणि पैसा दोन्ही वाचवा!",
      image: "https://res.cloudinary.com/dp8evydam/image/upload/v1748449189/Giggling_Platypus_Co._1_jl9gj3.png",
      click_action: "https://yourhub.com/tools",
      actions: [
        { action: "explore", title: "पहा" },
        { action: "dismiss", title: "बंद करा" }
      ]
    },
    {
      title: "मोफत वर्कशॉप: डिजिटल मार्केटिंग",
      body: "छोट्या व्यवसायांसाठी विशेष मार्गदर्शन – आजच नाव नोंदवा!",
      image: "https://res.cloudinary.com/dp8evydam/image/upload/v1748282798/ChatGPT_Image_May_26_2025_11_33_32_PM_eckicl.png",
      click_action: "https://yourhub.com/workshop",
      actions: [
        { action: "register", title: "नोंदणी करा" },
        { action: "dismiss", title: "नंतर" }
      ]
    },
    {
      title: "सोशल मीडिया पोस्ट्स तयार करा सहज!",
      body: "डिझाइन स्किल्सशिवाय आकर्षक पोस्ट्स – फक्त काही क्लिकमध्ये!",
      image: "https://res.cloudinary.com/dp8evydam/image/upload/v1748449189/Giggling_Platypus_Co._1_jl9gj3.png",
      click_action: "https://yourhub.com/social-posts",
      actions: [
        { action: "create_post", title: "पोस्ट तयार करा" },
        { action: "dismiss", title: "बंद करा" }
      ]
    },
    {
      title: "ग्राहकांचा विश्वास मिळवा",
      body: "बिझनेस प्रोफाइल पूर्ण करा आणि ग्राहकांचा विश्वास जिंका.",
      image: "https://res.cloudinary.com/dp8evydam/image/upload/v1748282798/ChatGPT_Image_May_26_2025_11_33_32_PM_eckicl.png",
      click_action: "https://yourhub.com/profile",
      actions: [
        { action: "update_profile", title: "प्रोफाइल अपडेट करा" },
        { action: "dismiss", title: "नंतर" }
      ]
    },
    {
      title: "Whatsapp वरून थेट ग्राहकांशी बोला",
      body: "Whatsapp API सह व्यवसाय संवाद अधिक प्रभावी करा.",
      image: "https://res.cloudinary.com/dp8evydam/image/upload/v1748449189/Giggling_Platypus_Co._1_jl9gj3.png",
      click_action: "https://yourhub.com/whatsapp",
      actions: [
        { action: "connect_now", title: "कनेक्ट करा" },
        { action: "dismiss", title: "बंद करा" }
      ]
    },
    {
      title: "साप्ताहिक प्रेरणादायक टिप्स",
      body: "व्यवसाय वाढीसाठी नवीन आयडिया दर आठवड्याला – फुकट!",
      image: "https://res.cloudinary.com/dp8evydam/image/upload/v1748449189/Giggling_Platypus_Co._1_jl9gj3.png",
      click_action: "https://yourhub.com/tips",
      actions: [
        { action: "get_tips", title: "आजचे टिप्स पहा" },
        { action: "dismiss", title: "नंतर" }
      ]
    },
    {
      title: "AI चा वापर करा तुमच्या जाहिरातींमध्ये",
      body: "आता AI सह आकर्षक कॅप्शन आणि डिझाईन्स तयार करा.",
      image: "https://res.cloudinary.com/dp8evydam/image/upload/v1748282798/ChatGPT_Image_May_26_2025_11_33_32_PM_eckicl.png",
      click_action: "https://yourhub.com/ai-tools",
      actions: [
        { action: "try_ai", title: "AI वापरा" },
        { action: "dismiss", title: "बंद करा" }
      ]
    },
    {
      title: "ईमेल मार्केटिंग मोहीम सुरू करा",
      body: "ग्राहकांपर्यंत पोहोचण्यासाठी परिणामकारक ईमेल पाठवा.",
      image: "https://res.cloudinary.com/dp8evydam/image/upload/v1748449189/Giggling_Platypus_Co._1_jl9gj3.png",
      click_action: "https://yourhub.com/email-campaign",
      actions: [
        { action: "start_campaign", title: "मोहीम सुरू करा" },
        { action: "dismiss", title: "नंतर" }
      ]
    },
    {
      title: "फेस्टिव्ह ऑफर्स तयार करा",
      body: "आगामी सणांसाठी आकर्षक ऑफर्स डिझाइन करा आणि शेअर करा.",
      image: "https://res.cloudinary.com/dp8evydam/image/upload/v1748282798/ChatGPT_Image_May_26_2025_11_33_32_PM_eckicl.png",
      click_action: "https://yourhub.com/festival-offers",
      actions: [
        { action: "create_offer", title: "ऑफर तयार करा" },
        { action: "dismiss", title: "बंद करा" }
      ]
    },
    {
      title: "ग्राहक अभिप्राय गोळा करा",
      body: "सेवा सुधारण्यासाठी आपल्या ग्राहकांचे मत जाणून घ्या.",
      image: "https://res.cloudinary.com/dp8evydam/image/upload/v1748449189/Giggling_Platypus_Co._1_jl9gj3.png",
      click_action: "https://yourhub.com/feedback",
      actions: [
        { action: "collect_feedback", title: "अभिप्राय घ्या" },
        { action: "dismiss", title: "नंतर" }
      ]
    },
    {
      title: "संपूर्ण जाहिरात कॅलेंडर मिळवा",
      body: "मासिक प्लॅन तयार करा – वेळेची बचत करा आणि नियोजन करा.",
      image: "https://res.cloudinary.com/dp8evydam/image/upload/v1748282798/ChatGPT_Image_May_26_2025_11_33_32_PM_eckicl.png",
      click_action: "https://yourhub.com/calendar",
      actions: [
        { action: "view_calendar", title: "कॅलेंडर पहा" },
        { action: "dismiss", title: "बंद करा" }
      ]
    },
    {
      title: "व्यवसायासाठी SEO शिकणे सुरू करा",
      body: "आपल्या वेबसाइटला Google वर वर आणण्यासाठी एसईओ मार्गदर्शन!",
      image: "https://res.cloudinary.com/dp8evydam/image/upload/v1748449189/Giggling_Platypus_Co._1_jl9gj3.png",
      click_action: "https://yourhub.com/seo",
      actions: [
        { action: "learn_seo", title: "शिका" },
        { action: "dismiss", title: "बंद करा" }
      ]
    }
  ];
// Pick a random notification
const getRandomNotification = () => {
  const template = marathiNotifications[Math.floor(Math.random() * marathiNotifications.length)];

  return {
    ...template,
    actions: JSON.stringify([
      { action: "open_url", title: "Open Website" },
      { action: "dismiss", title: "Dismiss" },
      { action: "unsubscribe", title: "Unsubscribe" },
    ]),
    timestamp: new Date().toISOString(),
    priority: "high",
  };
};

// Build FCM payload from notification object
const buildNotificationPayload = (notification) => (
  console.log("Building notification payload:", notification),
  
  {
  notification: {
    title: notification.title,
    body: notification.body,
    image: notification.image,
  },
  data: {
    click_action: notification.click_action,
    ...(notification.actions && { actions: notification.actions }),
  },
});

// Next.js API GET handler
export async function GET(request) {
  try {
    await connectDB();

    const { searchParams } = new URL(request.url);
    const userIds = searchParams.get("userIds")?.split(",").filter(Boolean) || [];
    const testMode = searchParams.get("test") === "true";

    // Query tokens by userIds or get all
    const query = userIds.length ? { user: { $in: userIds } } : {};
    const tokens = testMode ? ["TEST_TOKEN"] : await FcmTokenModel.distinct("token", query);

    if (!tokens.length) {
      return new Response(
        JSON.stringify({ success: false, message: "No active devices found" }),
        { status: 404, headers: { "Content-Type": "application/json" } }
      );
    }

    const notification = getRandomNotification();
    const payload = buildNotificationPayload(notification);

    if (testMode) {
      return new Response(
        JSON.stringify({
          success: true,
          test: true,
          notification,
          payload,
          wouldSendTo: tokens.length,
        }),
        { status: 200, headers: { "Content-Type": "application/json" } }
      );
    }

    const results = await sendBatchNotifications(tokens, payload);

    return new Response(
      JSON.stringify({
        success: true,
        sent: results.filter((r) => r.success).length,
        failed: results.filter((r) => !r.success).length,
        results,
      }),
      { status: 200, headers: { "Content-Type": "application/json" } }
    );
  } catch (error) {
    console.error("Error in GET /api/sendNotification:", error);
    return new Response(
      JSON.stringify({ success: false, error: error.message }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
}
