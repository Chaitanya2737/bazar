// Import Firebase scripts (compat version for service worker)
importScripts('https://www.gstatic.com/firebasejs/9.6.10/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/9.6.10/firebase-messaging-compat.js');

// Initialize Firebase app in the service worker
firebase.initializeApp({
  apiKey: "AIzaSyDXEHl85bVHMWwXdXLF5DCjXt0T9ZOtq2I",
  authDomain: "sms-sender-b3081.firebaseapp.com",
  projectId: "sms-sender-b3081",
  storageBucket: "sms-sender-b3081.appspot.com",
  messagingSenderId: "697685965425",
  appId: "1:697685965425:web:d8dcaa63bff6dab15f79d0",
  measurementId: "G-CNBR538QZJ"
});

// Retrieve Firebase Messaging instance
const messaging = firebase.messaging();

// Handle background messages
messaging.onBackgroundMessage((payload) => {
  console.log('[Service Worker] Received background message:', payload);

  // Use notification payload fields if available, else fallback to data fields
  const notificationTitle = payload.notification?.title || payload.data.title || "Notification";
  const notificationBody = payload.notification?.body || payload.data.body || "";
  const notificationImage = payload.notification?.image || payload.data.image || undefined;
  const notificationIcon = payload.notification?.icon || payload.data.icon || '/icons/icon-192x192.png';
  const notificationBadge = payload.notification?.badge || '/icons/badge.png';
  const clickAction = payload.notification?.click_action || payload.data.click_action || '/';

  // Parse actions from data (stringified JSON), with fallback to default actions
  let parsedActions = [];
  try {
    parsedActions = JSON.parse(payload.data.actions) || [];
  } catch (e) {
    parsedActions = [
      { action: "open_url", title: "Open" },
      { action: "dismiss", title: "Close" }
    ];
  }

  // Build notification options
  const notificationOptions = {
    body: notificationBody,
    icon: notificationIcon,
    badge: notificationBadge,
    image: notificationImage,
    vibrate: [300, 100, 400],
    requireInteraction: parsedActions.length > 0,
    data: {
      click_action: clickAction,
      token: payload.data.token || null,
      ...payload.data
    },
    actions: parsedActions
  };

  // Show the notification
  self.registration.showNotification(notificationTitle, notificationOptions);
});

// Notification click event handler
self.addEventListener('notificationclick', (event) => {
  const { notification, action } = event;
  const clickAction = notification.data.click_action || '/';

  event.notification.close();

  // Handle action buttons
  if (action === 'open_url' || !action) {
    // Open the click_action URL
    event.waitUntil(
      clients.matchAll({ type: 'window', includeUncontrolled: true }).then(windowClients => {
        for (const client of windowClients) {
          if (client.url === clickAction && 'focus' in client) {
            return client.focus();
          }
        }
        if (clients.openWindow) {
          return clients.openWindow(clickAction);
        }
      })
    );
  } else if (action === 'unsubscribe') {
    // Call unsubscribe API with token from notification data
    event.waitUntil(
      fetch('/api/unsubscribe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token: notification.data.token })
      }).then(response => {
        if (!response.ok) {
          console.error('Unsubscribe API failed');
        }
      }).catch(console.error)
    );
  } else {
    // Handle other custom actions if any
    console.log(`Notification action clicked: ${action}`);
  }
});

// Notification close (dismiss) event handler
self.addEventListener('notificationclose', (event) => {
  console.log('Notification was closed:', event.notification.data);
});
