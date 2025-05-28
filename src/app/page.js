"use client";

import { useEffect, useState, useCallback, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getMessagingInstance } from "@/lib/firebase.config";
import { getToken, onMessage, getMessaging } from "firebase/messaging";
import Navbar from "@/component/navBar/page";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";

const NOTIF_STORAGE_KEY = "notif_prompted";

export default function Home() {
  const dispatch = useDispatch();
  const darkMode = useSelector((state) => state.theme.darkMode);

  const [mounted, setMounted] = useState(false);
  const [permissionStatus, setPermissionStatus] = useState("default");
  const [showPrompt, setShowPrompt] = useState(false);
  const [loading, setLoading] = useState(false);

  const toastId = useRef(null); // To track if custom toast is visible

  // On mount: check notification permission and localStorage prompt state
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

  // Clear prompt and reset localStorage
  const clearLocalStorage = useCallback(() => {
    localStorage.removeItem(NOTIF_STORAGE_KEY);
    setPermissionStatus("default");
    setShowPrompt(true);
  }, []);

  // Listen for foreground messages (ignored here)
  useEffect(() => {
    const messaging = getMessagingInstance();
    if (!messaging) return;

    const unsubscribe = onMessage(messaging, (payload) => {
      console.log("📩 Foreground message received (ignored):", payload);
    });

    return () => unsubscribe();
  }, []);

  // Register service worker for Firebase messaging and get token if permission granted
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
                } else {
                  console.warn("⚠️ No registration token available.");
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

  // Request notification permission and get token
  const requestPermissions = useCallback(async () => {
    setLoading(true);

    // Dismiss custom prompt toast if visible
    if (toastId.current) {
      toast.dismiss(toastId.current);
      toastId.current = null;
    }

    try {
      const permission = await Notification.requestPermission();
      setPermissionStatus(permission);
      localStorage.setItem(NOTIF_STORAGE_KEY, "asked");
      setShowPrompt(false);

      if (permission !== "granted") {
        toast.info("🔕 Notifications permission denied.");
        setLoading(false);
        return;
      }

      const messaging = getMessaging();
      const token = await getToken(messaging, {
        vapidKey: process.env.NEXT_PUBLIC_VAPID_KEY,
      });

      if (!token) {
        toast.error("❌ Failed to get FCM token.");
        setLoading(false);
        return;
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
        }),
      });

      toast.success("✅ Notifications enabled!");
    } catch (error) {
      console.error("❌ Error in notification permission flow:", error);
      toast.error("❌ Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  }, []);

  // Handle showing custom prompt or denied message with single toast instance
  useEffect(() => {
    if (permissionStatus === "default" && showPrompt) {
      if (!toastId.current) {
        const audio = new Audio("/mixkit-message-pop-alert-2354.mp3");
        audio.play().catch(() => {});

        toastId.current = toast.custom((t) => (
          <div
            className="bg-white dark:bg-gray-800 border border-blue-400 p-5 rounded-lg shadow-lg text-sm text-gray-900 dark:text-gray-100 w-[360px] flex flex-col gap-4"
            tabIndex={0}
          >
            <div className="flex items-center gap-3">
              <span className="text-3xl animate-bell-bounce">🔔</span>
              <h2 className="font-bold text-lg">Stay in the Loop!</h2>
            </div>

            <p className="text-gray-700 dark:text-gray-300">
              We’d love to send you <strong>important updates</strong> and helpful tips.
              Enable notifications to never miss out!
            </p>

            <div className="flex gap-3">
              <Button
                onClick={requestPermissions}
                variant="default"
                className="flex-grow"
                disabled={loading}
              >
                {loading ? "Enabling..." : "Yes, Notify Me! 🚀"}
              </Button>

              <Button
                variant="outline"
                onClick={() => {
                  toast.dismiss(toastId.current);
                  toastId.current = null;
                  setShowPrompt(false);
                }}
                disabled={loading}
              >
                Maybe Later
              </Button>
            </div>
          </div>
        ));
      }
    } else {
      if (toastId.current) {
        toast.dismiss(toastId.current);
        toastId.current = null;
      }
    }

    if (!showPrompt && permissionStatus === "denied") {
      if (!toastId.current) {
        toastId.current = toast.custom((t) => (
          <div
            className="bg-white dark:bg-gray-900 border border-red-500 p-5 rounded-lg shadow-lg text-sm text-red-700 dark:text-red-400 w-[360px] flex flex-col gap-4"
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
                toast.dismiss(toastId.current);
                toastId.current = null;
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
        <button onClick={clearLocalStorage}>Clear data</button>
      </div>
      <Navbar />
      {/* Your other page content here */}
    </div>
  );
}
