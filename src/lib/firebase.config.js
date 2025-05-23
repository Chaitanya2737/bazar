// src/lib/firebase.config.js
import { initializeApp, getApps, getApp } from "firebase/app";

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY ,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN ,
  projectId: process.env.NEXT_PUBLIC_PROJECT_ID ,
  storageBucket: process.env.NEXT_PUBLIC_STORAGE_BUCKET , // ✅ FIXED
  messagingSenderId: process.env.NEXT_PUBLIC_MESSAGING_SENDER_ID ,
  appId: process.env.NEXT_PUBLIC_APP_ID ,
  measurementId: process.env.NEXT_PUBLIC_MEASUREMENT_ID 
};

// Prevent re-initializing on hot reloads
const app = getApps().length ? getApp() : initializeApp(firebaseConfig);

export { app };

// Export only on client
export const getMessagingInstance = () => {
  if (typeof window !== "undefined") {
    const { getMessaging } = require("firebase/messaging"); // ✅ only loads in browser
    return getMessaging(app);
  }
  return null;
};

export const getAnalyticsInstance = () => {
  if (typeof window !== "undefined") {
    const { getAnalytics } = require("firebase/analytics");
    return getAnalytics(app);
  }
  return null;
};
