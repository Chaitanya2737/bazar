"use client";

import React from "react";
import { useRouter } from "next/navigation"; 
const Success = () => {
  const router = useRouter();

  const handleGoBack = () => {
    router.push("/");
  };

  return (
    <div className="relative flex items-center justify-center min-h-screen overflow-hidden">
      {/* Animated Gradient Background */}
      <div className="absolute inset-0 z-0 gradient-animation" />

      {/* Foreground Message */}
      <div className="relative z-10 bg-white p-8 rounded-lg shadow-lg text-center" aria-live="polite">
        <h2 className="text-2xl font-bold mb-4">🎉 Congrats</h2>
        <p className="text-gray-600 mb-6">Your site is now live in production!</p>
        <button
          onClick={handleGoBack}
          className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors"
        >
          Go Back
        </button>
      </div>
    </div>
  );
};

export default Success;