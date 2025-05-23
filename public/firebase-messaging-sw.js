// Import Firebase core and messaging scripts
importScripts("https://www.gstatic.com/firebasejs/8.10.0/firebase-app.js");
importScripts("https://www.gstatic.com/firebasejs/8.10.0/firebase-messaging.js");

// ✅ Firebase config
const firebaseConfig = {
  apiKey: "AIzaSyDXEHl85bVHMWwXdXLF5DCjXt0T9ZOtq2I",
  authDomain: "sms-sender-b3081.firebaseapp.com",
  projectId: "sms-sender-b3081",
  storageBucket: "sms-sender-b3081.appspot.com",
  messagingSenderId: "697685965425",
  appId: "1:697685965425:web:d8dcaa63bff6dab15f79d0",
  measurementId: "G-CNBR538QZJ",
};

// ✅ Initialize Firebase
firebase.initializeApp(firebaseConfig);

// ✅ Get Messaging instance
const messaging = firebase.messaging();

// ✅ Handle background messages
messaging.onBackgroundMessage((payload) => {
  console.log("🔔 Received background message:", payload);

  const notificationTitle = payload?.notification?.title || "📲 New Notification";
  const notificationOptions = {
    body: payload?.notification?.body || "You have a new message.",
    icon: "/icons/icon-192x192.png",
    requireInteraction: false, // Optional: Let notification auto-dismiss
    tag: Date.now().toString(), // 🔄 Ensures new notification every time
    data: {
      click_action: payload?.data?.click_action || "https://your-website.com",
    },
  };

  self.registration.showNotification(notificationTitle, notificationOptions);
});

// ✅ Handle notification click
self.addEventListener("notificationclick", (event) => {
  console.log("🔘 Notification clicked:", event.notification);
  event.notification.close();

  const clickActionUrl = event.notification?.data?.click_action || "https://your-website.com";

  event.waitUntil(
    clients.matchAll({ type: "window", includeUncontrolled: true }).then((clientList) => {
      for (const client of clientList) {
        if (client.url === clickActionUrl && "focus" in client) {
          return client.focus();
        }
      }
      if (clients.openWindow) {
        return clients.openWindow(clickActionUrl);
      }
    }).catch((err) => {
      console.error("🚨 Error opening notification click URL:", err);
    })
  );
});
