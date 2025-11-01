import Razorpay from "razorpay";
import { NextResponse } from "next/server";

export async function POST(request) {
  try {
    // ✅ Initialize Razorpay instance using server-side secrets
    const razorpay = new Razorpay({
      key_id: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
      key_secret: process.env.RAZORPAY_KEY_SECRET,
    });

    console.log("🔑 Razorpay keys loaded:", !!process.env.RAZORPAY_KEY_ID, !!process.env.RAZORPAY_KEY_SECRET);

    // Optionally, read amount from client
    const body = await request.json().catch(() => ({}));
    const amount = body.amount || 100; // default ₹100

    // ✅ Create Razorpay order (amount is in paise)
    const order = await razorpay.orders.create({
      amount: amount * 100,
      currency: "INR",
      receipt: `rcptid_${Math.floor(Math.random() * 1000)}`,
    });

    console.log("✅ Order created:", order);

    // ✅ Return clean JSON response
    return NextResponse.json(order);
  } catch (error) {
    console.error("❌ Razorpay order creation error:", error);
    return NextResponse.json(
      { error: "Failed to create Razorpay order" },
      { status: 500 }
    );
  }
}
