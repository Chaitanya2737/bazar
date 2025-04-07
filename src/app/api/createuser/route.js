import { NextResponse } from "next/server";
import { multerMiddleware } from "@/lib/middleware";
import connectDB from "@/lib/db";

export async function POST(req) {
  try {
    await connectDB()
    // formData is key in request
    const formData = await req.formData();

    const businessName = formData.get("businessName");
    const handlerName = formData.get("handlerName");
    const email = formData.get("email");
    const categories = formData.get("categories");
    const businessIcon = formData.get("businessIcon");

    console.log("Received Fields:", { businessName, handlerName, email, categories });

    if (!businessIcon) {
      return NextResponse.json({ error: "No file uploaded" }, { status: 400 });
    }

    // Pass only the file to multerMiddleware
    const fileUrl = await multerMiddleware(businessIcon , businessName);

    return NextResponse.json({ success: true, fileUrl });
  } catch (error) {
    console.log("Upload Error:", error);
    return NextResponse.json({ error: error.message || "Internal Server Error" }, { status: 500 });
  }
}
