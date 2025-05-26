import { initializeApp, getApps, cert } from "firebase-admin/app";
import { getMessaging } from "firebase-admin/messaging";

// Initialize the app with your service account
let adminApp;

const privateKey = process.env.FIREBASE_PRIVATE_KEY.replace(/\\n/g, "\n")
if (!getApps().length) {
  adminApp = initializeApp({
    credential: cert({
      projectId: process.env.FIREBASE_PROJECT_ID,
      clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
      privateKey: privateKey,
    }),
  });
} else {
  adminApp = getApps()[0];
}

export const admin = {
  messaging: () => getMessaging(adminApp),
};
