"use client";

import { useEffect, useState, useCallback } from "react";
import { useSelector } from "react-redux";
import { getMessagingInstance } from "@/lib/firebase.config";
import { getToken, onMessage } from "firebase/messaging";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";

const NOTIF_STORAGE_KEY = "notif-permission-choice";

const isNotificationSupported = () => {
  return typeof window !== "undefined" && "Notification" in window;
};

// Reverse geocode fallback
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
  } catch {
    return "Unknown Location";
  }
}

const getLocation = () =>
  new Promise((resolve) => {
    if (!navigator.geolocation) {
      resolve({ latitude: 0, longitude: 0 });
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (pos) => resolve(pos.coords),
      () => resolve({ latitude: 0, longitude: 0 })
    );
  });

export default function NotificationManager() {
  const darkMode = useSelector((state) => state.theme.darkMode);

  const [mounted, setMounted] = useState(false);
  const [permissionStatus, setPermissionStatus] = useState("default");
  const [showPrompt, setShowPrompt] = useState(false);
  const [loading, setLoading] = useState(false);

  // Mount check
  useEffect(() => {
    if (typeof window === "undefined") return;

    const storedChoice = localStorage.getItem(NOTIF_STORAGE_KEY);

    const browserPermission = isNotificationSupported()
      ? Notification.permission
      : "unsupported";

    setPermissionStatus(browserPermission);

    if (browserPermission === "default" && storedChoice !== "asked") {
      setShowPrompt(true);
    }

    setMounted(true);
  }, []);

  // Foreground messages
  useEffect(() => {
    const messaging = getMessagingInstance();
    if (!messaging) return;

    const unsubscribe = onMessage(messaging, (payload) => {
      console.log("📩 Foreground message:", payload);

      if (
        isNotificationSupported() &&
        Notification.permission === "granted" &&
        payload.notification
      ) {
        const notif = new Notification(payload.notification.title, {
          body: payload.notification.body,
          icon: "/icons/icon-192x192.png",
        });

        notif.onclick = () => {
          window.open(payload.data?.url || "https://bazar.sh", "_blank");
        };
      } else {
        alert(`${payload.notification?.title}\n${payload.notification?.body}`);
      }
    });

    return () => unsubscribe();
  }, []);

  // Request permission
  const requestPermissions = useCallback(async () => {
    if (!isNotificationSupported()) {
      toast.error("Notifications are not supported on this device.");
      return;
    }

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
        toast.error("Failed to get notification token.");
        return;
      }

      const location = await getLocation();

      let cityName = "Unknown Location";

      if (location?.latitude && location?.longitude) {
        cityName = await reverseGeocode(
          location.latitude,
          location.longitude
        );
      }

      await fetch("/api/fcmtoken", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          token,
          location,
          city: cityName,
          device: navigator.userAgent,
        }),
      });

      toast.success("Notifications enabled successfully 🎉");
    } catch (error) {
      console.error(error);
      toast.error("Something went wrong.");
    } finally {
      setLoading(false);
    }
  }, []);

  // Register service worker
  useEffect(() => {
    if ("serviceWorker" in navigator) {
      navigator.serviceWorker.register("/firebase-messaging-sw.js");
    }
  }, []);

  // Notification prompt
  useEffect(() => {
    if (permissionStatus === "default" && showPrompt) {
      toast.custom((t) => (
        <div className="bg-white dark:bg-gray-800 border border-blue-400 p-5 rounded-lg shadow-lg w-[360px] flex flex-col gap-4">
          <h2 className="font-bold text-lg flex items-center gap-2">
            🔔 Stay Updated
          </h2>

          <p>Enable notifications so you do not miss updates.</p>

          <div className="flex gap-3">
            <Button onClick={requestPermissions} disabled={loading}>
              {loading ? "Enabling..." : "Enable Notifications"}
            </Button>

            <Button
              variant="outline"
              onClick={() => {
                toast.dismiss(t);
                setShowPrompt(false);
              }}
            >
              Later
            </Button>
          </div>
        </div>
      ));
    }
  }, [permissionStatus, showPrompt, requestPermissions, loading]);

  if (!mounted) return null;

  return null;
}