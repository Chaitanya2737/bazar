import { initializeApp, getApps, cert } from "firebase-admin/app";
import { getMessaging } from "firebase-admin/messaging";
import serviceAccount from "./sms-sender-b3081-firebase-adminsdk-fbsvc-1a91b74973.json"; // Adjust the path as necessary

let adminApp;

try {

  if (!getApps().length) {
    adminApp = initializeApp({
      credential: cert(serviceAccount),
    });
  } else {
    adminApp = getApps()[0];
  }
} catch (error) {
  console.error("Failed to initialize Firebase Admin SDK:", error.message);
  throw error;
}

export const admin = {
  messaging: () => getMessaging(adminApp),
};