export const config = {
  runtime: "nodejs",
};
import { NextResponse } from "next/server";
import { multerMiddleware } from "@/lib/middleware";
import connectDB from "@/lib/db";
import UserModel from "@/model/user.model";
import bcrypt from "bcryptjs";
import CategoryModel from "@/model/categories.model";
import AdminModel from "@/model/admin.model";

export async function POST(req) {
  try {
    // Connect to the database
    await connectDB();
    
    // Parse the form data
    const formData = await req.formData();
    const businessIcon = formData.get("businessIcon");
    const userDataJson = formData.get("userdata");
    

    // Parse user data
    let user;
    try {
      user = JSON.parse(userDataJson);
    } catch (error) {
      console.error("Invalid JSON format for userdata:", error);
      return NextResponse.json(
        { success: false, message: "Invalid userdata format." },
        { status: 400 }
      );
    }

    // Destructure user data
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

    // Validate required fields
    if (!businessName || !businessLocation || !admin || !email || !password) {
      return NextResponse.json(
        { success: false, message: "Missing required fields." },
        { status: 400 }
      );
    }

    // Validate mobile numbers
    const validatedMobileNumbers = Array.isArray(mobileNumbers) ? mobileNumbers : [mobileNumbers];
    if (validatedMobileNumbers.length < 1 || validatedMobileNumbers.length > 4) {
      return NextResponse.json(
        { success: false, message: "Mobile numbers must be between 1 and 4." },
        { status: 400 }
      );
    }

    // Check if user already exists
    const existingUser = await UserModel.findOne({ email });
    if (existingUser) {
      return NextResponse.json(
        { success: false, message: "User with this email already exists." },
        { status: 409 }
      );
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    console.log("hash generated");

    // Handle business icon upload
    let fileUrl = "/Sample_User_Icon.png"; // Default icon
    try {
      const uploadedUrl = await multerMiddleware(businessIcon, businessName);
      if (uploadedUrl) fileUrl = uploadedUrl;
    } catch (uploadError) {
      console.error("File upload error:", uploadError);
      fileUrl = "/Default_Error_Icon.png"; // Use a default error icon in case of upload failure
    }
    console.log("file generated");
    // Fetch category document
    const category = await CategoryModel.findOne({ name: categories });
    if (!category) {
      return NextResponse.json(
        { success: false, message: "Category not found." },
        { status: 404 }
      );
    }

    console.log("categories check");

    // Fetch admin document
    const adminDoc = await AdminModel.findOne({ name: admin });
    if (!adminDoc) {
      return NextResponse.json(
        { success: false, message: "Admin not registered." },
        { status: 404 }
      );
    }
    console.log("admin check");

    // Create new user document
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
      businessIcon: fileUrl,
    });

    await newUser.save();
    console.log(newUser);

    // Return success response
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
    console.log("error comming for here");
    console.error("Registration Error:", error);
    return NextResponse.json(
      {
        success: false,
        message: error.message || "Internal Server Error",
        stack: process.env.NODE_ENV === "development" ? error.stack : undefined, // Include stack trace only in development mode
      },
      { status: 500 }
    );
  }
}
