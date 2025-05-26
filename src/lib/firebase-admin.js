import { initializeApp, getApps, cert } from "firebase-admin/app";
import { getMessaging } from "firebase-admin/messaging";
import serviceAccount from "./serviceAccountKey.json"; // Adjust the path to your service account key
// Initialize the app with your service account
let adminApp;

const privateKey = process.env.FIREBASE_PRIVATE_KEY.replace(/\\n/g, "\n")
if (!getApps().length) {
  adminApp = initializeApp({
    credential: cert(serviceAccount),
  });
} else {
  adminApp = getApps()[0];
}

export const admin = {
  messaging: () => getMessaging(adminApp),
};
