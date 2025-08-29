"use client";

import { useEffect, useState, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import Navbar, { SupportNavForLaptop } from "@/component/navBar/page";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import Maincomp from "@/component/mainpage/main";
import Head from "next/head";

const NOTIF_STORAGE_KEY = "notif_prompted";

export default function Home() {
  const dispatch = useDispatch();
  const darkMode = useSelector((state) => state.theme.darkMode);

  const [mounted, setMounted] = useState(false);
  const [permissionStatus, setPermissionStatus] = useState("default");
  const [showPrompt, setShowPrompt] = useState(false);
  const [loading, setLoading] = useState(false);

  const toastId = useRef(null);

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

  if (!mounted) return null;

  const metadata = {
    title: "Bazar.sh - Business Hub for Small & Medium Enterprises",
    description:
      "Build your business website effortlessly with Bazar.sh — the all-in-one platform for small and medium enterprises. Promote your brand using SMS, WhatsApp, Meta ads, and engage your customers with powerful push notifications.",
    keywords:
      "bazar, business hub, small business website, medium business website, business website builder, ...",
    url: "https://bazar.sh",
    images: [
      "https://res.cloudinary.com/dp8evydam/image/upload/v1752949353/bazar.sh_social_png_ou5arw.png",
    ],
  };

  return (
    <>
      <Head>
        <title>{metadata.title}</title>
        <meta name="description" content={metadata.description} />
        <meta name="keywords" content={metadata.keywords} />
        <meta property="og:title" content={metadata.title} />
        <meta property="og:description" content={metadata.description} />
        <meta property="og:url" content={metadata.url} />
        {metadata.images.length > 0 && (
          <meta property="og:image" content={metadata.images[0]} />
        )}
        <meta property="og:type" content="website" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={metadata.title} />
        <meta name="twitter:description" content={metadata.description} />
        {metadata.images.length > 0 && (
          <meta name="twitter:image" content={metadata.images[0]} />
        )}
        <link rel="canonical" href={metadata.url} />
      </Head>

      <div
        className={`bg-light text-foregroundLight dark:bg-gray-800 dark:text-foregroundDark min-h-screen p-4 ${
          darkMode ? "dark" : ""
        }`}
      >
        <Navbar />
        <div className="pb-16 md:pb-16">
          <Maincomp />
        </div>
        <SupportNavForLaptop />
      </div>
    </>
  );
}