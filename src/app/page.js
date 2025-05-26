"use client";

import { useEffect, useState, useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getMessagingInstance } from "@/lib/firebase.config";
import { getToken } from "firebase/messaging";
import Navbar from "@/component/navBar/page";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { onMessage } from "firebase/messaging";

const NOTIF_STORAGE_KEY = "notif-permission-choice";

async function reverseGeocode(lat, lon) {
  try {
    const res = await fetch(
      `https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${lat}&lon=${lon}`
    );
    if (!res.ok) throw new Error("Failed to reverse geocode");
    const data = await res.json();
    return (
      data.address.city ||
      data.address.town ||
      data.address.village ||
      data.address.hamlet ||
      "Unknown Location"
    );
  } catch (error) {
    console.warn("Reverse geocode error:", error);
    return "Unknown Location";
  }
}

const getLocation = () =>
  new Promise((resolve, reject) => {
    if (!navigator.geolocation) {
      reject(new Error("Geolocation not supported"));
      return;
    }
    navigator.geolocation.getCurrentPosition(
      (pos) => resolve(pos.coords),
      (err) => reject(err)
    );
  });

export default function Home() {
  const dispatch = useDispatch();
  const darkMode = useSelector((state) => state.theme.darkMode);

  const [mounted, setMounted] = useState(false);
  const [permissionStatus, setPermissionStatus] = useState("default");
  const [showPrompt, setShowPrompt] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined") return;

    const storedChoice = localStorage.getItem(NOTIF_STORAGE_KEY);
    const browserPermission = Notification.permission;

    setPermissionStatus(browserPermission);

    if (browserPermission === "default" && storedChoice !== "asked") {
      setShowPrompt(true);
    }

    setMounted(true);
  }, []);

    const clearloaclStorage = useCallback(() => {
    localStorage.removeItem(NOTIF_STORAGE_KEY);
    setPermissionStatus("default");
    setShowPrompt(true);
  }
, []);

  useEffect(() => {
    const messaging = getMessagingInstance();

    if (messaging) {
      const unsubscribe = onMessage(messaging, (payload) => {
        console.log("📩 Foreground message received:", payload);
        alert(`${payload.notification?.title}\n${payload.notification?.body}`);
      });

      return () => unsubscribe();
    }
  }, []);
  function YourComponent() {
    useEffect(() => {
      // Get messaging instance
      const messaging = getMessaging();

      // Request notification permission upfront
      if (Notification.permission !== "granted") {
        Notification.requestPermission().then((permission) => {
          if (permission !== "granted") {
            console.warn("Notification permission not granted.");
          }
        });
      }

      // Set up onMessage listener
      const unsubscribe = onMessage(messaging, (payload) => {
        console.log("📥 Foreground message: ", payload);

        if (Notification.permission === "granted" && payload.notification) {
          new Notification(payload.notification.title, {
            body: payload.notification.body,
            icon: "/icons/icon-192x192.png",
            tag: Date.now().toString(), // Unique tag
          });
        }
      });

      // Clean up listener on unmount
      return () => unsubscribe();
    }, []);

    return null; // or your component JSX
  }

  const requestPermissions = useCallback(async () => {
    setLoading(true);
    try {
      const permission = await Notification.requestPermission();
      setPermissionStatus(permission);
      localStorage.setItem(NOTIF_STORAGE_KEY, "asked");
      setShowPrompt(false);

      if (permission !== "granted") {
        setLoading(false);
        return;
      }

      const messaging = getMessagingInstance();
      const token = await getToken(messaging, {
        vapidKey: process.env.NEXT_PUBLIC_VAPID_KEY,
      });

      if (!token) {
        toast.error("❌ Failed to get FCM token.");
        setLoading(false);
        return;
      }

      // Initialize location and xcityName with null or defaults
      let location = null;
      let cityName = null;

      try {
        location = await getLocation();
        cityName = await reverseGeocode(location.latitude, location.longitude);
        console.log("User location coords:", location);
        console.log("User city:", cityName);
      } catch (err) {
        console.log("User denied location or error occurred:", err);
        // If error, set location to null explicitly to avoid reference errors
        location = null;
        cityName = "Unknown Location";
      }

      const deviceInfo = navigator.userAgent || "Unknown Device";
      const platform = navigator.platform || "Unknown Platform";
      const appVersion = process.env.NEXT_PUBLIC_APP_VERSION || "1.0.0";

      await fetch("/api/fcmtoken", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          token,
          deviceInfo,
          platform,
          appVersion,
          location,
          city: cityName,
        }),
      });
    } catch (error) {
      console.error("❌ Error getting token:", error);
      toast.error("❌ Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if ("serviceWorker" in navigator) {
      navigator.serviceWorker
        .register("/firebase-messaging-sw.js")
        .then((registration) => {
          console.log("✅ Service Worker registered:", registration);

          if (Notification.permission === "granted") {
            getToken(getMessagingInstance(), {
              vapidKey: process.env.NEXT_PUBLIC_VAPID_KEY,
              serviceWorkerRegistration: registration,
            })
              .then((currentToken) => {
                if (currentToken) {
                  console.log("✅ FCM Token:", currentToken);
                  // Optionally send token to your server
                } else {
                  console.warn(
                    "⚠️ No registration token available. Request permission to generate one."
                  );
                }
              })
              .catch((err) => {
                console.error("❌ Error retrieving FCM token:", err);
              });
          } else {
            console.warn("🔔 Notification permission not granted");
          }
        })
        .catch((err) => {
          console.error("❌ Service Worker registration failed:", err);
        });
    }
  }, []);

  useEffect(() => {
    if (permissionStatus === "default" && showPrompt) {
      const audio = new Audio("/mixkit-message-pop-alert-2354.mp3");
      audio.play().catch((err) => {
        console.warn("Autoplay failed:", err);
      });

      toast.custom((t) => (
        <div
          className="bg-white dark:bg-gray-800 border border-blue-400 p-5 rounded-lg shadow-lg text-sm text-gray-900 dark:text-gray-100 w-[360px] transition-colors duration-300 ease-in-out focus:outline-none focus:ring-4 focus:ring-blue-400/50 flex flex-col gap-4"
          tabIndex={0}
        >
          <div className="flex items-center gap-3">
            <span
              className="text-3xl animate-bell-bounce"
              aria-label="notification bell"
              role="img"
            >
              🔔
            </span>
            <h2 className="font-bold text-lg">Stay in the Loop!</h2>
          </div>

          <p className="text-gray-700 dark:text-gray-300">
            We’d love to send you <strong>important updates</strong> and helpful
            tips. Enable notifications to never miss out!
          </p>

          <div className="flex gap-3">
            <Button
              onClick={requestPermissions}
              variant="default"
              className="flex-grow transition-transform duration-200 hover:scale-105"
              disabled={loading}
            >
              {loading ? "Enabling..." : "Yes, Notify Me! 🚀"}
            </Button>

            <Button
              variant="outline"
              onClick={() => {
                toast.dismiss(t);
                setShowPrompt(false);
              }}
              className="transition-transform duration-200 hover:scale-105"
              disabled={loading}
            >
              Maybe Later
            </Button>
          </div>
        </div>
      ));
    }

    if (!showPrompt && permissionStatus === "denied") {
      toast.custom((t) => (
        <div
          className="
          bg-white dark:bg-gray-900
          border border-red-500
          p-5 rounded-lg shadow-lg
          text-sm text-red-700 dark:text-red-400
          w-[360px]
          transition-colors duration-300 ease-in-out
          focus:outline-none focus:ring-4 focus:ring-red-500/50
          flex flex-col gap-4
          "
          tabIndex={0}
        >
          <div className="flex items-center gap-3">
            <span className="text-3xl animate-shake">🚫</span>
            <h2 className="font-bold text-lg">Notifications Blocked</h2>
          </div>

          <p>
            It looks like notifications are blocked. To stay updated, please
            enable notifications in your browser settings.
          </p>

          <Button
            onClick={() => {
              toast.dismiss(t);
              setShowPrompt(true);
              localStorage.removeItem(NOTIF_STORAGE_KEY);
            }}
            variant="default"
          >
            Retry Permission
          </Button>
        </div>
      ));
    }
  }, [showPrompt, permissionStatus, requestPermissions, loading]);

  if (!mounted) return null;

  return (
    <div
      className={`bg-light text-foregroundLight dark:bg-gray-800 dark:text-foregroundDark min-h-screen p-4 ${
        darkMode ? "dark" : ""
      }`}
    >
       <div>
      <button onClick={clearloaclStorage}> clear data </button>
    </div>
      <Navbar />
      {/* Your other page content here */}
    </div>
  );
}
