export const runtime = "nodejs"; // ✅ for App Router & file upload

import { NextResponse } from "next/server";

import connectDB from "@/lib/db";
import UserModel from "@/model/user.model";
import bcrypt from "bcryptjs";
import CategoryModel from "@/model/categories.model";
import AdminModel from "@/model/admin.model";

import { v2 as cloudinary } from "cloudinary";

// Configuration
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export async function POST(req) {
  try {
    await connectDB();

    const formData = await req.formData();
    const userDataJson = formData.get("userdata");

    if (!userDataJson) {
      return NextResponse.json(
        { success: false, message: "userdata is missing" },
        { status: 400 }
      );
    }

    let user;
    try {
      user = JSON.parse(userDataJson);
    } catch (error) {
      return NextResponse.json(
        { success: false, message: "Invalid userdata format" },
        { status: 400 }
      );
    }

    const {
      businessName,
      handlerName,
      mobileNumbers,
      email,
      password,
      bio,
      address,
      businessLocation,
      state,
      GstNumber,
      language,
      categories,
      admin,
      role,
      insta,
      facebook,
      x,
      linkedin,
      youtube,
      expiringDate,
    } = user;

    if (!businessName || !businessLocation || !admin || !email || !password) {
      return NextResponse.json(
        { success: false, message: "Missing required fields" },
        { status: 400 }
      );
    }

    const validatedMobileNumbers = Array.isArray(mobileNumbers)
      ? mobileNumbers
      : [mobileNumbers];
    if (
      validatedMobileNumbers.length < 1 ||
      validatedMobileNumbers.length > 4
    ) {
      return NextResponse.json(
        { success: false, message: "Mobile numbers must be between 1 and 4" },
        { status: 400 }
      );
    }

    // ⬇️ Upload business icon
    const file = formData.get("businessIcon");
    let uploadedImage = null;

    if (!file || typeof file.arrayBuffer !== "function") {
      return NextResponse.json(
        { error: "Valid businessIcon file not found" },
        { status: 400 }
      );
    }

    try {
      const bytes = await file.arrayBuffer();
      const buffer = Buffer.from(bytes);

      uploadedImage = await new Promise((resolve, reject) => {
        const stream = cloudinary.uploader.upload_stream(
          {
            folder: "next-cloudinary-uploads",
            resource_type: "auto",
          },
          (error, result) => {
            if (error) {
              reject(error);
            } else {
              resolve(result.secure_url);
            }
          }
        );
        stream.end(buffer);
      });
    } catch (error) {
      console.error("Cloudinary upload error:", error);
      return NextResponse.json(
        { success: false, message: "Upload image failed" },
        { status: 500 }
      );
    }

    // Check for existing user
    const existingUser = await UserModel.findOne({ email });
    if (existingUser) {
      return NextResponse.json(
        { success: false, message: "User with this email already exists." },
        { status: 409 }
      );
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const category = await CategoryModel.findOne({ name: categories });
    if (!category) {
      return NextResponse.json(
        { success: false, message: "Category not found." },
        { status: 404 }
      );
    }

    const adminDoc = await AdminModel.findOne({ name: admin });
    if (!adminDoc) {
      return NextResponse.json(
        { success: false, message: "Admin not registered." },
        { status: 404 }
      );
    }

    const newUser = new UserModel({
      businessName,
      handlerName,
      mobileNumber: validatedMobileNumbers,
      email,
      password: hashedPassword,
      bio,
      address,
      businessLocation,
      state,
      GstNumber,
      language,
      categories: category._id,
      admin: adminDoc._id,
      role,
      expiringDate,
      socialMediaLinks: {
        insta: insta || "",
        youtube: youtube || "",
        facebook: facebook || "",
        x: x || "",
        linkedin: linkedin || "",
      },
      businessIcon: uploadedImage.secure_url,
    });

    await newUser.save();

    return NextResponse.json(
      {
        success: true,
        message: "User registered successfully.",
        data: {
          id: newUser._id,
          businessName: newUser.businessName,
          email: newUser.email,
        },
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Unhandled Error:", error);
    return NextResponse.json(
      {
        success: false,
        message: error.message || "Internal Server Error",
      },
      { status: 500 }
    );
  }
}


export async function GET() {
  await connectDB();
  const test = cloudinary.config();
  //  const user =  await UserModel.find();
  return NextResponse.json(test);
}
