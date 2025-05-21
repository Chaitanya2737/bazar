import admin from "firebase-admin";
import { applicationDefault } from "firebase-admin/app";

process.env.GOOGLE_APPLICATION_CREDENTIALS
if (!admin.apps.length) {
  admin.initializeApp({
    credential: applicationDefault()
  });
}

export { admin };
