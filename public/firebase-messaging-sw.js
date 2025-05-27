// firebase-messaging-sw.js

importScripts("https://www.gstatic.com/firebasejs/8.10.0/firebase-app.js");
importScripts("https://www.gstatic.com/firebasejs/8.10.0/firebase-messaging.js");

const firebaseConfig = {
  apiKey: "AIzaSyDXEHl85bVHMWwXdXLF5DCjXt0T9ZOtq2I",
  authDomain: "sms-sender-b3081.firebaseapp.com",
  projectId: "sms-sender-b3081",
  storageBucket: "sms-sender-b3081.firebasestorage.app",
  messagingSenderId: "697685965425",
  appId: "1:697685965425:web:d8dcaa63bff6dab15f79d0",
  measurementId: "G-CNBR538QZJ"
};

firebase.initializeApp(firebaseConfig);
const messaging = firebase.messaging();

messaging.onBackgroundMessage((payload) => {
  const notificationTitle = payload?.notification?.title || "📲 New Notification";
  const notificationOptions = {
    body: payload?.notification?.body || "You have a new message.",  // fixed typo here
    icon: "/icons/icon-192x192.png",
    requireInteraction: false,
    tag: Date.now().toString(),
    actions: [
      {
        action: "open_url",
        title: "Open Website",
        icon: "/icons/open-icon.png"
      },
      {
        action: "dismiss",
        title: "Dismiss",
        icon: "/icons/close-icon.png"
      }
    ],
    data: {
      click_action: payload?.data?.click_action || "https://bazar-tau-eight.vercel.app/",
      url: payload?.data?.url || "https://bazar-tau-eight.vercel.app/",
    },
  };

  self.registration.showNotification(notificationTitle, notificationOptions);
});
self.addEventListener("notificationclick", (event) => {
  event.notification.close();

  const urlToOpen = event.action === "open_url"
    ? event.notification.data.url
    : event.action === "dismiss"
    ? null
    : event.notification.data.click_action || "https://bazar-tau-eight.vercel.app/";

  if (!urlToOpen) {
    // User clicked 'dismiss', no action
    return;
  }

  event.waitUntil(
    clients.matchAll({ type: "window", includeUncontrolled: true }).then(clientList => {
      for (const client of clientList) {
        // Normalize URLs if needed here
        if (client.url === urlToOpen && "focus" in client) {
          return client.focus();
        }
      }
      if (clients.openWindow) {
        return clients.openWindow(urlToOpen);
      }
    }).catch(err => {
      console.error("Failed to open or focus window:", err);
    })
  );
});