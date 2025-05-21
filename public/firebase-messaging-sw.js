/* eslint-disable no-undef */
importScripts("https://www.gstatic.com/firebasejs/8.10.0/firebase-app.js");
importScripts("https://www.gstatic.com/firebasejs/8.10.0/firebase-messaging.js");

// ✅ Your Firebase config
const firebaseConfig = {
  apiKey: "AIzaSyDXEHl85bVHMWwXdXLF5DCjXt0T9ZOtq2I",
  authDomain: "sms-sender-b3081.firebaseapp.com",
  projectId: "sms-sender-b3081",
  storageBucket: "sms-sender-b3081.appspot.com",
  messagingSenderId: "697685965425",
  appId: "1:697685965425:web:d8dcaa63bff6dab15f79d0",
  measurementId: "G-CNBR538QZJ",
};


firebase.initializeApp(firebaseConfig);


const messaging = firebase.messaging();



// ✅ Handle background messages
messaging.onBackgroundMessage((payload) => {
  console.log("🔔 Received background message:", payload);
debugger


  const notificationTitle = payload.notification?.title || "New Notification";
  const notificationOptions = {
    body: payload.notification?.body,
    icon: "/logo.png", // Optional: replace with your app's icon
    data: {
      click_action: payload.data?.click_action || "https://your-website.com", // fallback
    },
  };
debugger

  self.registration.showNotification(notificationTitle, notificationOptions);
debugger

});


self.addEventListener("notificationclick", function (event) {
  console.log("🔘 Notification clicked:", event.notification);

  event.notification.close();

  const clickActionUrl = event.notification.data?.click_action || "https://your-website.com";

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
});
