const admin = require('firebase-admin');
const serviceAccountPath = process.env.FIREBASE_ADMINSDK_PATH;

admin.initializeApp({
  credential: admin.credential.cert(require(serviceAccountPath))
});
