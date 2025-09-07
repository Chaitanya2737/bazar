"use client";

import { useEffect, useState, useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getMessagingInstance } from "@/lib/firebase.config";
import { getToken, onMessage } from "firebase/messaging";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";

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

/**
 * 🔔 NotificationManager Component
 * Handles notification permission, FCM token retrieval & prompts
 */
export default function NotificationManager() {
  const dispatch = useDispatch();
  const darkMode = useSelector((state) => state.theme.darkMode);

  const [mounted, setMounted] = useState(false);
  const [permissionStatus, setPermissionStatus] = useState("default");
  const [showPrompt, setShowPrompt] = useState(false);
  const [loading, setLoading] = useState(false);
  const [deniedToastShown, setDeniedToastShown] = useState(false);

  // Mount + check stored choice
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



  // Foreground message handler
  useEffect(() => {
    const messaging = getMessagingInstance();
    if (messaging) {
      const unsubscribe = onMessage(messaging, (payload) => {
        console.log("📩 Foreground message received:", payload);

        if (Notification.permission === "granted" && payload.notification) {
          const notif = new Notification(payload.notification.title, {
            body: payload.notification.body,
            icon: "/icons/icon-192x192.png",
            tag: Date.now().toString(),
            data: {
              click_action: payload.data?.click_action || "https://bazar.sh",
              url: payload.data?.url || "https://bazar.sh",
            },
          });

          notif.onclick = (event) => {
            event.preventDefault();
            window.open(event.target.data.url, "_blank");
            notif.close();
          };
        } else {
          alert(
            `${payload.notification?.title}\n${payload.notification?.body}`
          );
        }
      });

      return () => unsubscribe();
    }
  }, []);

  // Request notification + FCM token
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

      let location = null;
      let cityName = null;

      try {
        location = await getLocation();
        cityName = await reverseGeocode(location.latitude, location.longitude);
      } catch {
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

  // Register service worker
  useEffect(() => {
    if ("serviceWorker" in navigator) {
      navigator.serviceWorker
        .register("/firebase-messaging-sw.js")
        .then((registration) => {
          console.log(" Service Worker registered:", registration);

          if (Notification.permission === "granted") {
            getToken(getMessagingInstance(), {
              vapidKey: process.env.NEXT_PUBLIC_VAPID_KEY,
              serviceWorkerRegistration: registration, // 👈 HERE
            })
              .then((currentToken) => {
                if (currentToken) {
                  console.log("✅ FCM Token:", currentToken);
                } else {
                  console.warn("⚠️ No registration token available.");
                }
              })
              .catch((err) => {
                console.error("❌ Error retrieving FCM token:", err);
              });
          }
        })
        .catch((err) => {
          console.error("❌ Service Worker registration failed:", err);
        });
    }
  }, []);

  // Toast prompts
  useEffect(() => {
    // Prompt when permission is "default"
    if (permissionStatus === "default" && showPrompt) {
      const audio = new Audio("/mixkit-message-pop-alert-2354.mp3");
      audio.play().catch(() => {});

      toast.custom((t) => (
        <div className="bg-white dark:bg-gray-800 border border-blue-400 p-5 rounded-lg shadow-lg w-[360px] flex flex-col gap-4">
          <div className="flex items-center gap-3">
            <span className="text-3xl">🔔</span>
            <h2 className="font-bold text-lg">Stay in the Loop!</h2>
          </div>

          <p>
            Enable notifications to never miss out on <strong>updates</strong>.
          </p>

          <div className="flex gap-3">
            <Button onClick={requestPermissions} disabled={loading}>
              {loading ? "Enabling..." : "Yes, Notify Me 🚀"}
            </Button>
            <Button
              variant="outline"
              onClick={() => {
                toast.dismiss(t);
                setShowPrompt(false);
              }}
            >
              Maybe Later
            </Button>
          </div>
        </div>
      ));
    }

    // Show blocked warning only once
    if (permissionStatus === "denied") {
      toast.custom((t) => (
        <div className="bg-white dark:bg-gray-900 border border-yellow-400 p-5 rounded-lg shadow-lg w-[360px] flex flex-col gap-4">
          <h2 className="font-bold text-lg flex items-center gap-2">
            🔕 Notifications Disabled
          </h2>

          <div className="flex gap-3">
            <Button
              variant="outline"
              onClick={() => setShowHelpModal(true)}
            >
              How to Enable?
            </Button>
            <Button variant="default" onClick={() => toast.dismiss(t)}>
              Okay
            </Button>
          </div>
        </div>
      ));
    }
  }, [
    showPrompt,
    permissionStatus,
    requestPermissions,
    loading,
    deniedToastShown,
  ]);

  if (!mounted) return null;
  return null;
}
