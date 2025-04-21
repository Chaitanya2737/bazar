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
  api_secret: process.env.CLOUDINARY_API_SECRET, // Click 'View Credentials' below to copy your API secret
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

    let result = "";
    try {
      const file = await formData.get("businessIcon");

      if (!file) {
        return NextResponse.json({ error: "File not found" }, { status: 400 });
      }

      const bytes = await file.arrayBuffer();
      const buffer = Buffer.from(bytes);

      result = await new Promise((resolve, reject) => {
        const uploadStream = cloudinary.uploader.upload_stream(
          { folder: "next-cloudinary-uploads" },
          (error, result) => {
            if (error) reject(error);
            else resolve(result);
          }
        );
        uploadStream.end(buffer);
      });
    } catch (error) {
      console.log("UPload image failed", error);
      return NextResponse.json(
        { error: "Upload image failed" },
        { status: 500 }
      );
    }
    console.log(result.secure_url);

    const existingUser = await UserModel.findOne({ email });
    if (existingUser) {
      return NextResponse.json(
        { success: false, message: "User with this email already exists." },
        { status: 409 }
      );
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    // ✅ Upload businessIcon to Cloudinary only if it's valid
    // let uploadedUrl = "";
    // if (
    //   businessIcon &&
    //   typeof businessIcon.arrayBuffer === "function" &&
    //   businessIcon.name
    // ) {
    //   try {
    //     const sanitizedFolderName = businessName
    //       .trim()
    //       .replace(/[^a-zA-Z0-9-_]/g, "-")
    //       .substring(0, 60);
    //     const arrayBuffer = await businessIcon.arrayBuffer();
    //     const buffer = Buffer.from(arrayBuffer);

    //     uploadedUrl = await new Promise((resolve, reject) => {
    //       const uploadOptions = {
    //         folder: sanitizedFolderName,
    //         resource_type: "auto",
    //         allowed_formats: ["jpg", "png", "jpeg", "webp", "gif"],
    //         max_file_size: 5 * 1024 * 1024,
    //       };

    //       const stream = cloudinary.uploader.upload_stream(
    //         uploadOptions,
    //         (error, result) => {
    //           if (error) {
    //             console.error("Cloudinary upload error:", error , cloudinary.config());
    //             reject(error);
    //           } else {
    //             resolve(result.secure_url);
    //           }
    //         }
    //       );

    //       stream.end(buffer);
    //     });
    //   } catch (err) {
    //     return NextResponse.json(
    //       { success: false, message: "Error uploading image to Cloudinary" },
    //       { status: 500 }
    //     );
    //   }
    // }

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
      businessIcon: result.secure_url,
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
    console.log("Error occurred:", error);
    return NextResponse.json(
      {
        success: false,
        message: error.message || "Internal Server Error",
        stack: process.env.NODE_ENV === "development" ? error.stack : undefined,
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
