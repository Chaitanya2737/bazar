
// src/lib/firebase.config.js
import { initializeApp, getApps, getApp } from "firebase/app";


const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_APP_ID,
  measurementId: process.env.NEXT_PUBLIC_MEASUREMENT_ID,
};

// const firebaseConfig = {
//   apiKey: "AIzaSyDXEHl85bVHMWwXdXLF5DCjXt0T9ZOtq2I",
//   authDomain: "sms-sender-b3081.firebaseapp.com",
//   projectId: "sms-sender-b3081",
//   storageBucket: "sms-sender-b3081.appspot.com",
//   messagingSenderId: "697685965425",
//   appId: "1:697685965425:web:d8dcaa63bff6dab15f79d0",
//   measurementId: "G-CNBR538QZJ"
// };
// Prevent re-initializing on hot reloads
const app = getApps().length ? getApp() : initializeApp(firebaseConfig);

export { app };

// Export functions that only run on client
export const getMessagingInstance = () => {
  if (typeof window !== "undefined") {
    const { getMessaging } = require("firebase/messaging");
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
