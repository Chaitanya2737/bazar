"use client";

import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getMessagingInstance } from "@/lib/firebase.config";
import { getToken } from "firebase/messaging";
import { setDarkMode } from "@/redux/slice/theme/themeSlice";
import Navbar from "@/component/navBar/page";

export default function Home() {
  const dispatch = useDispatch();
  const darkMode = useSelector((state) => state.theme.darkMode);
  const [mounted, setMounted] = useState(false);

  const requestPermissions = async () => {
    try {
      const permission = await Notification.requestPermission();
      if (permission === "granted") {
        const messaging = getMessagingInstance();
        const token = await getToken(messaging, {
          vapidKey: "BNChnVnkPGN9v1PBQVv_Oc63PNjBTjyMGo5COfj2LpqDN_iu5C1jjt4E23TPTFM878ficvwXQBEpwYg72HpwxmI"
        });

        console.log("🔑 FCM Token:", token);
      } else {
        console.log("❌ Notification Permission Denied");
      }
    } catch (error) {
      console.error("❌ Error getting token:", error);
    }
  };

  useEffect(() => {
    if (typeof window !== "undefined") {
      requestPermissions();
    }
    setMounted(true);
  }, []);

  if (!mounted) return null;

  return (
    <div className={`bg-light text-foregroundLight dark:bg-gray-800 dark:text-foregroundDark min-h-screen p-4 ${darkMode ? "dark" : ""}`}>
      <Navbar />
    </div>
  );
}
