import admin from "firebase-admin";
import fs from "fs";

if (!admin.apps.length) {
  const serviceAccountPath = process.env.FIREBASE_ADMINSDK_PATH;

  if (!serviceAccountPath) {
    throw new Error("Missing FIREBASE_ADMINSDK_PATH env variable");
  }

  const serviceAccount = JSON.parse(fs.readFileSync(serviceAccountPath, "utf-8"));

  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
  });
}

export { admin };
