import connectDB from "@/lib/db";
import {admin} from "@/lib/firebase-admin";
import FcmTokenModel from "@/model/fcm.module";

export async function GET() {
  try {

    await connectDB();
    const tokens = await FcmTokenModel.find();

    
    if (!tokens || tokens.length === 0) {
        return new Response(JSON.stringify({ message: "No token found" }), {
            status: 404,
            headers: { "Content-Type": "application/json" },
        });
    }
    
    const registrationTokens = tokens.map((tokenObj) => tokenObj.token);
    console.log(registrationTokens);


    const message = {
      notification: {
        title: "Hello from Server!",
        body: "This is a test notification.",
      },
      tokens: registrationTokens,
    };

    const response = await admin.messaging().sendEachForMulticast(message);

    return new Response(
      JSON.stringify({
        successCount: response.successCount,
        failureCount: response.failureCount,
        responses: response.responses,
        tokens: registrationTokens,
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
