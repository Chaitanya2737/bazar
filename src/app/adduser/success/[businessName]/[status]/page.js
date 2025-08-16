"use client";

import { useParams, useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";

// Replace spaces with hyphen but keep Marathi characters
function createSlug(name) {
  return name.trim()
    .replace(/\s+/g, "-")
    .replace(/[~!@#$%^&*()_+={}[\]|\\:;"'<>,.?/]/g, "") // remove unwanted symbols
    .replace(/-+/g, "-") // collapse multiple hyphens
    .toLowerCase();
}

const Success = () => {
  const router = useRouter();
  const params = useParams();
  // Decode the business name from URL params first
  const rawBusinessName = decodeURIComponent(params?.businessName || "");
  const businessSlug = createSlug(rawBusinessName);
  const status = params?.status || "";

  console.log(businessSlug);

  const [copied, setCopied] = useState(false);
  const [currentUrl, setCurrentUrl] = useState("");
  const [showOverlay, setShowOverlay] = useState(true);

  useEffect(() => {
    if (typeof window !== "undefined" && businessSlug) {
      // Keep Marathi characters as-is in the actual URL
      setCurrentUrl(`${window.location.origin}/${businessSlug}`);
    }
    const timer = setTimeout(() => setShowOverlay(false), 700);
    return () => clearTimeout(timer);
  }, [businessSlug]);

  const handleGoBack = () => {
    router.push(`/${businessSlug}`);
  };

  const handleCopy = () => {
    if (!currentUrl) return;
    navigator.clipboard.writeText(decodeURIComponent(currentUrl)).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    });
  };

  const handleShareWhatsApp = () => {
    if (!currentUrl) return;
    // WhatsApp still needs the message URL-encoded
    const message = `Hey! Check out our new site: ${currentUrl}`;
    window.open(`https://wa.me/?text=${encodeURIComponent(message)}`, "_blank");
  };

  return (
    <div className="relative flex items-center justify-center min-h-screen bg-gray-50 px-4 overflow-hidden">
      <div className="absolute inset-0 z-0 gradient-animation" />

      {showOverlay && (
        <div className="absolute inset-0 z-20 backdrop-blur-sm bg-white/40 transition-opacity duration-700" />
      )}

      <div
        className={`relative z-30 bg-white p-6 sm:p-8 rounded-lg shadow-lg text-center w-full max-w-md transition-all duration-700 transform ${
          showOverlay ? "opacity-0 translate-y-5" : "opacity-100 translate-y-0"
        }`}
      >
        <h2 className="text-2xl font-bold mb-4 break-words text-center">
          🎉 Congrats, {rawBusinessName}!
        </h2>
        <p className="text-gray-600 mb-6">Your site is now in production!</p>

        <button
          onClick={handleGoBack}
          className="mb-4 w-full px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition"
        >
          Visit Site
        </button>

        <button
          onClick={handleCopy}
          className="mb-4 w-full px-4 py-2 bg-gray-800 text-white rounded hover:bg-gray-900 transition"
        >
          {copied ? "Copied!" : "Copy URL"}
        </button>

        <button
          onClick={handleShareWhatsApp}
          className="w-full px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 transition"
        >
          Share on WhatsApp
        </button>
      </div>
    </div>
  );
};

export default Success;
