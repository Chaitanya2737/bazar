// Import Firebase scripts (non-modular version needed for service worker)
importScripts('https://www.gstatic.com/firebasejs/9.6.10/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/9.6.10/firebase-messaging-compat.js');

// Initialize Firebase app in the service worker
firebase.initializeApp({
  apiKey: "AIzaSyDXEHl85bVHMWwXdXLF5DCjXt0T9ZOtq2I",
  authDomain: "sms-sender-b3081.firebaseapp.com",
  projectId: "sms-sender-b3081",
  storageBucket: "sms-sender-b3081.appspot.com",  // <-- fixed this line
  messagingSenderId: "697685965425",
  appId: "1:697685965425:web:d8dcaa63bff6dab15f79d0",
  measurementId: "G-CNBR538QZJ"
});

// Retrieve Firebase Messaging instance
const messaging = firebase.messaging();

// Handle background messages
messaging.onBackgroundMessage((payload) => {
  // Destructure expected fields from payload.data
  const { title, body, image, actions, icon, click_action, token } = payload.data;

  // Parse actions JSON safely or fallback
  let parsedActions = [];
  try {
    parsedActions = JSON.parse(actions) || [];
  } catch {
    parsedActions = [
      { action: "open_url", title: "Open" },
      { action: "dismiss", title: "Close" }
    ];
  }

  // Prepare notification options
  const notificationOptions = {
    body,
    icon: icon || '/icons/icon-192x192.png',
    image,
    badge: '/icons/badge.png',
    vibrate: [300, 100, 400],
    requireInteraction: parsedActions.length > 0,
    data: {
      click_action,
      token,
      ...payload.data
    },
    actions: parsedActions
  };

  // Show notification
  self.registration.showNotification(title, notificationOptions);
});

// Notification click handler
self.addEventListener('notificationclick', (event) => {
  const { notification, action } = event;
  const url = notification.data.click_action;

  notification.close();

  if (action === "open_url" || !action) {
    event.waitUntil(clients.openWindow(url));
  } else if (action === "unsubscribe") {
    event.waitUntil(
      fetch("/api/unsubscribe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token: notification.data.token })
      })
    );
  }
});

// Notification close (dismiss) handler
self.addEventListener('notificationclose', (event) => {
  console.log('Notification closed', event.notification.data);
});
