"use client";

import { useParams, useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";

const Success = () => {
  const router = useRouter();
  const { businessName, status } = useParams();
  const [copied, setCopied] = useState(false);

const currentUrl = `${window.location.origin}/${businessName}`;

  const handleGoBack = () => {
    router.push(`/${businessName}`);
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(currentUrl).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    });
  };

  const handleShareWhatsApp = () => {
    const message = `Hey! Check out our new site: ${currentUrl}`;
    window.open(`https://wa.me/?text=${encodeURIComponent(message)}`, "_blank");
  };

  return (
    <div className="relative flex items-center justify-center min-h-screen overflow-hidden">
      <div className="absolute inset-0 z-0 gradient-animation" />
      <div className="relative z-10 bg-white p-8 rounded-lg shadow-lg text-center max-w-md">
        <h2 className="text-2xl font-bold mb-4">🎉 Congrats, {businessName}!</h2>
        <p className="text-gray-600 mb-6">Your site is now in production!</p>

        <button
          onClick={handleGoBack}
          className="mb-4 w-full px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
        >
          Visit Site
        </button>

        <button
          onClick={handleCopy}
          className="mb-4 w-full px-4 py-2 bg-gray-800 text-white rounded hover:bg-gray-900"
        >
          {copied ? "Copied!" : "Copy URL"}
        </button>

        <button
          onClick={handleShareWhatsApp}
          className="w-full px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
        >
          Share on WhatsApp
        </button>
      </div>
    </div>
  );
};

export default Success;
