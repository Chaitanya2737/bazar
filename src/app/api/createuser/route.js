export const runtime = "nodejs"; // ✅ for App Router & file upload

import { NextResponse } from "next/server";
import connectDB from "@/lib/db";
import UserModel from "@/model/user.model";
import bcrypt from "bcryptjs";
import CategoryModel from "@/model/categories.model";
import AdminModel from "@/model/admin.model";
import { v2 as cloudinary } from "cloudinary";

// Configure Cloudinary once
cloudinary.config({
  cloud_name: "dp8evydam",
  api_key: "591652925595255",
  api_secret:"hvHhjSg8Hf4LUfpDyJ9T_E42HoE",
  secure: true,
});

const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
const ALLOWED_FILE_TYPES = ['image/jpeg', 'image/png', 'image/webp'];

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

    // Validate required fields
    const requiredFields = ['businessName', 'businessLocation', 'admin', 'email', 'password'];
    const missingFields = requiredFields.filter(field => !user[field]);
    
    if (missingFields.length > 0) {
      return NextResponse.json(
        { 
          success: false, 
          message: `Missing required fields: ${missingFields.join(', ')}` 
        },
        { status: 400 }
      );
    }

    // Validate mobile numbers
    const validatedMobileNumbers = Array.isArray(user.mobileNumbers)
      ? user.mobileNumbers
      : [user.mobileNumbers];
      
    if (validatedMobileNumbers.length < 1 || validatedMobileNumbers.length > 4) {
      return NextResponse.json(
        { success: false, message: "Mobile numbers must be between 1 and 4" },
        { status: 400 }
      );
    }

    let businessIconUrl = '';
    const file = formData.get("businessIcon");
    
    if (file) {
      console.log("File found, starting upload");
      try {
        const bytes = await file.arrayBuffer();
        const buffer = Buffer.from(bytes);
    
        console.log("Uploading to Cloudinary...");
        const uploadResult = await new Promise((resolve, reject) => {
          const uploadStream = cloudinary.uploader.upload_stream(
            { 
              folder: "next-cloudinary-uploads",
              resource_type: "auto"
            },
            (error, result) => {
              if (error) {
                console.error("Cloudinary upload error:", error);
                reject(error);
              } else {
                console.log("Upload successful");
                resolve(result);
              }
            }
          );
          uploadStream.end(buffer);
        });
    
        businessIconUrl = uploadResult?.secure_url;
        console.log("File uploaded to:", businessIconUrl);
      } catch (uploadError) {
        console.error("File upload failed:", uploadError);
        // Return a proper JSON response even on upload failure
        return NextResponse.json(
          { 
            success: false, 
            message: "File upload failed",
            error: uploadError.message 
          },
          { status: 500 }
        );
      }
    } else {
      console.log("No file provided, continuing without business icon");
    }

    // Check for existing user
    const existingUser = await UserModel.findOne({ email: user.email });
    if (existingUser) {
      return NextResponse.json(
        { success: false, message: "User with this email already exists." },
        { status: 409 }
      );
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(user.password, 10);

    // Validate category
    const category = await CategoryModel.findOne({ name: user.categories });
    if (!category) {
      return NextResponse.json(
        { success: false, message: "Category not found." },
        { status: 404 }
      );
    }

    // Validate admin
    const adminDoc = await AdminModel.findOne({ name: user.admin });
    if (!adminDoc) {
      return NextResponse.json(
        { success: false, message: "Admin not registered." },
        { status: 404 }
      );
    }

    // Create new user
    const newUser = new UserModel({
      businessName: user.businessName,
      handlerName: user.handlerName,
      mobileNumber: validatedMobileNumbers,
      email: user.email,
      password: hashedPassword,
      bio: user.bio,
      address: user.address,
      businessLocation: user.businessLocation,
      state: user.state,
      GstNumber: user.GstNumber,
      language: user.language,
      categories: category._id,
      admin: adminDoc._id,
      role: user.role,
      expiringDate: user.expiringDate,
      socialMediaLinks: {
        insta: user.insta || "",
        youtube: user.youtube || "",
        facebook: user.facebook || "",
        x: user.x || "",
        linkedin: user.linkedin || "",
      },
      businessIcon: businessIconUrl,
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
  try {
    await connectDB();
    // Just return a success message for the GET endpoint
    return NextResponse.json(
      { success: true, message: "API is working" },
      { status: 200 }
    );
  } catch (error) {
    console.error("GET Error:", error);
    return NextResponse.json(
      { success: false, message: "Internal Server Error" },
      { status: 500 }
    );
  }
}