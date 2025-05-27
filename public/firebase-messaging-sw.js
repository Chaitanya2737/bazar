importScripts("https://www.gstatic.com/firebasejs/8.10.0/firebase-app.js");
importScripts("https://www.gstatic.com/firebasejs/8.10.0/firebase-messaging.js");

firebase.initializeApp({
  apiKey: "AIzaSyDXEHl85bVHMWwXdXLF5DCjXt0T9ZOtq2I",
  authDomain: "sms-sender-b3081.firebaseapp.com",
  projectId: "sms-sender-b3081",
  storageBucket: "sms-sender-b3081.appspot.com",
  messagingSenderId: "697685965425",
  appId: "1:697685965425:web:d8dcaa63bff6dab15f79d0",
  measurementId: "G-CNBR538QZJ",
});

const messaging = firebase.messaging();

messaging.onBackgroundMessage((payload) => {
  const { title, body, image, click_action, actions } = payload.data;
  console.log("Notification data:", { title, body, image, click_action, actions });

  let parsedActions = [];
  try {
    parsedActions = JSON.parse(actions); // Convert string to array
  } catch (err) {
    console.error("Error parsing actions:", err);
    parsedActions = [
      { action: "open_url", title: "Open Website" },
      { action: "dismiss", title: "Dismiss" },
    ];
  }

  self.registration.showNotification(title || "New Message", {
    body: body || "",
    icon: "/icons/icon-192x192.png",
    image: image || undefined,
    data: {
      click_action: click_action || "https://bazar-tau-eight.vercel.app/",
    },
    actions: parsedActions,
  });
});

// Optional: Handle notification click
self.addEventListener("notificationclick", (event) => {
  const action = event.action;
  const click_action = event.notification.data.click_action;

  event.notification.close();

  if (action === "open_url" || !action) {
    event.waitUntil(clients.openWindow(click_action));
  } else if (action === "unsubscribe") {
    // Future: Handle unsubscribe logic
    console.log("Unsubscribe clicked");
  }
});
