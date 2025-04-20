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
    const formData = await req.formData();
    const businessIcon = formData.get("businessIcon");
    const userDataJson = formData.get("userdata");
    const user = JSON.parse(userDataJson);
    const { businessName,
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

    // Basic Validation
    if (!businessName || !businessLocation || !admin ) {
      return NextResponse.json(
        {
          success: false,
          message:
            "Missing required fields. Please provide business name, location, admin, email, and password.",
        },
        { status: 400 } // Bad Request
      );
    }

    // Validate mobile numbers
    const validatedMobileNumbers = Array.isArray(mobileNumbers) ? mobileNumbers : [mobileNumbers];
    // Check that the array length is between 1 and 4
    if (validatedMobileNumbers.length < 1 || validatedMobileNumbers.length > 4) {
      return NextResponse.json({
        success: false,
        message: "Mobile numbers must be between 1 and 4.",
      });
    }


    // Check if the user already exists
    const existingUser = await UserModel.findOne({ email });
    if (existingUser) {
      return NextResponse.json(
        {
          success: false,
          message: "A user with this email already exists.",
        },
        { status: 409 }
      );
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Handle file upload
    let fileUrl;
    try {
      fileUrl = await multerMiddleware(businessIcon, businessName);
      if (!fileUrl) {
        // Default file if no icon is uploaded
        fileUrl = "@/assets/Sample_User_Icon.png"; // Ensure this path is publicly accessible
      }
    } catch (error) {
      console.error("File upload error:", error);
      fileUrl = "@/assets/Sample_User_Icon.png";
    }

    // Check if category exists and get its ID
    const category = await CategoryModel.findOne({ name: categories });
    if (!category) {
      return NextResponse.json({
        success: false,
        message: "Category not found.",
      });
    }

    // Check if admin exists and get its ID
    const adminDoc = await AdminModel.findOne({ name: admin });
    if (!adminDoc) {
      return NextResponse.json({
        success: false,
        message: "Admin not registered.",
      });
    }

    // Ensure expiringDate is provided or use default
    // if (!expiringDate) {
    //   return NextResponse.json({
    //     success: false,
    //     message: "Expiring date is required.",
    //   });
    // }

    // Create a new user document
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
        x: x || "", // Twitter (X)
        linkedin: linkedin || "",
      },
      businessIcon: fileUrl,
    });
    console.log(role);

    // Save the user to the database
    await newUser.save();

    // Return the response with user data
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
    return NextResponse.json(
      {
        success: false,
        message: error.message || "Internal Server Error",
      },
      { status: 500 } // Internal Server Error
    );
  }
}
