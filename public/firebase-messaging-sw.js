const messaging = firebase.messaging();

// Enhanced notification handler
messaging.onBackgroundMessage((payload) => {
  const { title, body, image, actions, icon } = payload.data;

  // Parse actions with fallback
  let parsedActions = [];
  try {
    parsedActions = JSON.parse(actions) || [];
  } catch {
    parsedActions = [
      { action: "open_url", title: "Open" },
      { action: "dismiss", title: "Close" }
    ];
  }

  // Notification options
  const options = {
    body,
    icon: icon || "/icons/icon-192x192.png",
    image,
    data: { ...payload.data }, // Forward all data
    actions: parsedActions,
    vibrate: [300, 100, 400],
    badge: "/icons/badge.png",
    requireInteraction: parsedActions.length > 0
  };

  return self.registration.showNotification(title, options);
});

// Notification click handler
self.addEventListener("notificationclick", (event) => {
  const { notification, action } = event;
  const url = notification.data.click_action;

  notification.close();

  switch (action) {
    case "open_url":
      event.waitUntil(clients.openWindow(url));
      break;
      
    case "unsubscribe":
      event.waitUntil(
        fetch("/api/unsubscribe", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ token: notification.data.token })
        })
      );
      break;

    default:
      // Default click behavior
      event.waitUntil(clients.openWindow(url));
  }
});

// Track notification dismissals
self.addEventListener("notificationclose", (event) => {
  console.log("Notification dismissed:", event.notification.data);
});