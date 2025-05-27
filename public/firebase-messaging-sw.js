// Import Firebase core and messaging scripts
importScripts("https://www.gstatic.com/firebasejs/8.10.0/firebase-app.js");
importScripts("https://www.gstatic.com/firebasejs/8.10.0/firebase-messaging.js");

// ✅ Firebase config
const firebaseConfig = {
  apiKey: "AIzaSyDXEHl85bVHMWwXdXLF5DCjXt0T9ZOtq2I",
  authDomain: "sms-sender-b3081.firebaseapp.com",
  projectId: "sms-sender-b3081",
  storageBucket: "sms-sender-b3081.firebasestorage.app",
  messagingSenderId: "697685965425",
  appId: "1:697685965425:web:d8dcaa63bff6dab15f79d0",
  measurementId: "G-CNBR538QZJ"
};

// ✅ Initialize Firebase
firebase.initializeApp(firebaseConfig);

// ✅ Get Messaging instance
const messaging = firebase.messaging();

// ✅ Handle background messages
messaging.onBackgroundMessage((payload) => {
  const notificationTitle = payload?.notification?.title || "📲 New Notification";
  const notificationOptions = {
    body: payload?.notification?.body || "You have a new message.",
    icon: "/icons/icon-192x192.png",
    requireInteraction: false, // Notification auto-dismiss
    tag: Date.now().toString(), // New notification every time

    // Add actions here - example with two buttons
    actions: [
      {
        action: "open_url",
        title: "Open Website",
        icon: "/icons/open-icon.png" // optional
      },
      {
        action: "dismiss",
        title: "Dismiss",
        icon: "/icons/close-icon.png" // optional
      }
    ],

    data: {
      click_action: payload?.data?.click_action || "https://bazar-tau-eight.vercel.app/",
      url: payload?.data?.url || "https://bazar-tau-eight.vercel.app/", // example to use inside action handlers
    },
  };

  self.registration.showNotification(notificationTitle, notificationOptions);
});

self.addEventListener("notificationclick", (event) => {
  console.log("🔘 Notification clicked:", event.notification, "Action:", event.action);
  event.notification.close();

  // Handle action buttons
  if (event.action === "open_url") {
    // Open the URL passed in notification data
    event.waitUntil(
      clients.matchAll({ type: "window", includeUncontrolled: true }).then((clientList) => {
        for (const client of clientList) {
          if (client.url === event.notification.data.url && "focus" in client) {
            return client.focus();
          }
        }
        if (clients.openWindow) {
          return clients.openWindow(event.notification.data.url);
        }
      })
    );
  } else if (event.action === "dismiss") {
    // Just close notification - already closed above
    // You can add additional logic if needed
  } else {
    // Handle generic notification click (outside of action buttons)
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
      })
    );
  }
});
