"use client";

import Script from "next/script";
import React, { useState } from "react";

const Razorpay = () => {
  const amount = 100;
  const [isProcessing, setIsProcessing] = useState(false);

  const handlePayment = async () => {
    try {
      setIsProcessing(true);

      // Create an order from your backend API route
      const response = await fetch("/api/razorpay", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ amount }), // send amount if needed
      });

      if (!response.ok) throw new Error("Failed to create order");

      const data = await response.json();
      console.log("🧾 Order data:", data);

      const options = {
        key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID, // ✅ must be NEXT_PUBLIC
        amount: data.amount,
        currency: data.currency,
        name: "Bazar SH",
        description: "Test Transaction",
        order_id: data.id,
        handler: function (response) {
          console.log("Payment Success:", response);
          alert("Payment successful!");
        },
        prefill: {
          name: "Chaitanya",
          email: "chaitanyasatarkar123@gmail.com",
          contact: "1234567890",
        },
        notes: {
          address: "Razorpay Corporate Office",
        },
        theme: {
          color: "#3399cc",
        },
      };

      const razorpay = new window.Razorpay(options);
      razorpay.open();
    } catch (error) {
      console.error("Payment Error:", error);
      alert("Something went wrong. Try again.");
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="p-6 text-center">
      {/* Razorpay SDK */}
      <Script src="https://checkout.razorpay.com/v1/checkout.js" />

      <h1 className="text-2xl font-bold mb-2">Payment Page</h1>
      <p className="mb-4">Amount: ₹{amount}</p>

      <button
        onClick={handlePayment}
        disabled={isProcessing}
        className={`px-6 py-2 rounded-lg font-semibold text-white ${
          isProcessing ? "bg-gray-400" : "bg-blue-600 hover:bg-blue-700"
        }`}
      >
        {isProcessing ? "Processing..." : "Pay Now"}
      </button>
    </div>
  );
};

export default Razorpay;
