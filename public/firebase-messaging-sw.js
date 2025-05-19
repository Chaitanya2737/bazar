/* eslint-disable no-undef */
importScripts("https://www.gstatic.com/firebasejs/8.10.0/firebase-app.js");
importScripts("https://www.gstatic.com/firebasejs/8.10.0/firebase-messaging.js");

// ✅ Add your Firebase project configuration
const firebaseConfig = {
  apiKey: "AIzaSyDXEHl85bVHMWwXdXLF5DCjXt0T9ZOtq2I",
  authDomain: "sms-sender-b3081.firebaseapp.com",
  projectId: "sms-sender-b3081",
  storageBucket: "sms-sender-b3081.appspot.com",
  messagingSenderId: "697685965425",
  appId: "1:697685965425:web:d8dcaa63bff6dab15f79d0",
  measurementId: "G-CNBR538QZJ"
};

// ✅ Initialize Firebase in the service worker
firebase.initializeApp(firebaseConfig);

// ✅ Retrieve an instance of Firebase Messaging
const messaging = firebase.messaging();

// ✅ Handle background messages
messaging.onBackgroundMessage((payload) => {
  console.log("[firebase-messaging-sw.js] Received background message ", payload);
  
  const { title, body, image } = payload.notification;

  const notificationOptions = {
    body: body,
    icon: image || '/firebase-logo.png', // optional default
  };

  self.registration.showNotification(title, notificationOptions);
});
