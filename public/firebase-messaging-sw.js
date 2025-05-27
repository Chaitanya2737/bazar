// Import Firebase scripts
importScripts("https://www.gstatic.com/firebasejs/8.10.0/firebase-app.js");
importScripts("https://www.gstatic.com/firebasejs/8.10.0/firebase-messaging.js");

// Initialize Firebase
firebase.initializeApp({
  apiKey: "AIzaSyDXEHl85bVHMWwXdXLF5DCjXt0T9ZOtq2I",
  authDomain: "sms-sender-b3081.firebaseapp.com",
  projectId: "sms-sender-b3081",
  storageBucket: "sms-sender-b3081.appspot.com",
  messagingSenderId: "697685965425",
  appId: "1:697685965425:web:d8dcaa63bff6dab15f79d0",
  measurementId: "G-CNBR538QZJ"
});

const messaging = firebase.messaging();

// Handle background messages
messaging.onBackgroundMessage((payload) => {
  console.log('[firebase-messaging-sw.js] Received background message ', payload);
  
  // Extract notification data with fallbacks
  const notificationTitle = payload?.notification?.title || payload?.data?.title || "New Message";
  const notificationBody = payload?.notification?.body || payload?.data?.body || "";
  const notificationImage = payload?.notification?.image || payload?.data?.image;
  const clickAction = payload?.data?.click_action || "https://bazar-tau-eight.vercel.app/";
  
  // Default actions
  let notificationActions = [
    { action: "open_url", title: "Open Website" },
    { action: "dismiss", title: "Dismiss" }
  ];
  
  // Try to parse custom actions if provided
  try {
    if (payload?.data?.actions) {
      notificationActions = JSON.parse(payload.data.actions);
    }
  } catch (err) {
    console.error("Error parsing actions:", err);
  }

  // Show notification
  const notificationOptions = {
    body: notificationBody,
    icon: '/icons/icon-192x192.png', // Your app icon
    image: notificationImage,
    data: { 
      click_action: clickAction,
      ...payload.data // Include all payload data
    },
    actions: notificationActions,
    vibrate: [200, 100, 200] // Vibration pattern
  };

  return self.registration.showNotification(notificationTitle, notificationOptions);
});

// Handle notification click
self.addEventListener('notificationclick', (event) => {
  console.log('Notification clicked:', event);
  
  const action = event.action;
  const notification = event.notification;
  const clickAction = notification.data.click_action;
  const payloadData = notification.data;

  notification.close();

  // Handle different actions
  if (action === 'open_url' || !action) {
    // Default action - open URL
    event.waitUntil(
      clients.openWindow(clickAction)
    );
  } else if (action === 'dismiss') {
    // Just close the notification
    return;
  } else {
    // Handle custom actions
    console.log('Custom action clicked:', action);
    // You can add custom logic for other actions here
  }

  // You can send analytics about the click here if needed
});

// Optional: Handle notification close
self.addEventListener('notificationclose', (event) => {
  console.log('Notification closed:', event);
  // You can track notification dismissals here
});