import { NextResponse } from "next/server";
import connectDB from "@/lib/db";
import UserModel from "@/model/user.model";
import CategoryModel from "@/model/categories.model";
import AdminModel from "@/model/admin.model";
import bcrypt from "bcryptjs";
import cloudinary from "@/lib/cloudinaryConfig";
import slugify from "slugify";


const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
const ALLOWED_TYPES = ["image/jpeg", "image/png", "image/webp", "image/jpeg"];

function generateSlug(name) {
  return name
    .trim()
    .replace(/\s+/g, "-") // spaces → hyphens
    .replace(/[~!@#$%^&*()_+={}[\]|\\:;"'<>,.?/]/g, "") // remove unwanted symbols
    .replace(/-+/g, "-") // collapse multiple hyphens
    .toLowerCase(); // lowercases only Latin letters, Marathi stays as-is
}



export async function POST(req) {
  try {
    await connectDB();
    const formData = await req.formData();
    const userDataJson = formData.get("userdata");

    if (!userDataJson) {
      return NextResponse.json(
        { success: false, message: "Missing userdata" },
        { status: 400 }
      );
    }
  

    let user;
    try {
      user = JSON.parse(userDataJson);
    } catch {
      return NextResponse.json(
        { success: false, message: "Invalid JSON format for userdata" },
        { status: 400 }
      );
    }

    const required = [
      "businessName",
      "businessLocation",
      "admin",
      "email",
      "password",
    ];

    const missingFields = required.filter((field) => !user[field]);
    if (missingFields.length) {
      return NextResponse.json(
        {
          success: false,
          message: `Missing required fields: ${missingFields.join(", ")}`,
        },
        { status: 400 }
      );
    }

    const mobileNumbers = Array.isArray(user.mobileNumbers)
      ? user.mobileNumbers
      : [user.mobileNumbers];

    if (mobileNumbers.length < 1 || mobileNumbers.length > 4) {
      return NextResponse.json(
        {
          success: false,
          message: "Mobile numbers must be between 1 and 4",
        },
        { status: 400 }
      );

    }


    // Validate references
    const adminDoc = await AdminModel.findById(user.admin );
    if (!adminDoc) {
      return NextResponse.json(
        { success: false, message: "Admin not found" },
        { status: 404 }
      );
    }

    const category = await CategoryModel.findById(user.categories);
    if (!category) {
      return NextResponse.json(
        { success: false, message: "Category not found" },
        { status: 404 }
      );
    }

    
    // Hash the password
    const hashedPassword = await bcrypt.hash(user.password, 10);
let slugVariable = generateSlug(user.businessName);

    // File upload handling
    let businessIconUrl = "";
    const file = formData.get("businessIcon");

    if (file) {
      if (!ALLOWED_TYPES.includes(file.type)) {
        return NextResponse.json(
          { success: false, message: "Unsupported file type" },
          { status: 400 }
        );
      }

      if (file.size > MAX_FILE_SIZE) {
        return NextResponse.json(
          { success: false, message: "File size exceeds 5MB" },
          { status: 400 }
        );
      }

     let folder = (user.businessName || "").trim();



      const arrayBuffer = await file.arrayBuffer();
      const buffer = Buffer.from(arrayBuffer);
      const base64 = buffer.toString("base64");
      const dataUri = `data:${file.type};base64,${base64}`;

      try {
        const uploaded = await cloudinary.uploader.upload(dataUri, {
          folder: folder || "business-icons",
        });
        businessIconUrl = uploaded.secure_url;
      } catch (uploadErr) {
        console.error("Cloudinary upload error:", uploadErr);
        return NextResponse.json(
          { success: false, message: "Failed to upload image to Cloudinary" },
          { status: 500 }
        );
      }
    }


  



    // Create new user
    const newUser = new UserModel({
      businessName: user.businessName,
      slug:slugVariable,
      handlerName: user.handlerName,
      mobileNumber: mobileNumbers,
      email: user.email,
      password: hashedPassword,
      bio: user.bio,
      address: user.address,
      businessLocation: user.businessLocation,
      state: user.state,
      gstNumber: user.GstNumber,
      language: user.language,
      categories: category._id,
      admin: adminDoc._id,
      role: user.role || "user",
      expiringDate: user.expiringDate,
      socialMediaLinks: {
        insta: user.insta || "",
        youtube: user.youtube || "",
        facebook: user.facebook || "",
        x: user.x || "",
        linkedin: user.linkedin || "",
      },
      businessIcon: businessIconUrl,
      count:0
    });

    await newUser.save();

    return NextResponse.json(
      {
        success: true,
        message:
          "User created successfully || todo :- we have work on whatsapp message api",
        user: {
          id: newUser._id,
          businessName: newUser.businessName,
          email: newUser.email,
        },
      },
      { status: 201 }
    );
  } catch (error) {
  console.error("Unhandled error:", error);

  // Handle MongoDB Duplicate Key Error
  if (error.code === 11000) {
    const duplicateField = Object.keys(error.keyPattern)[0]; // e.g., "businessName"
    const duplicateValue = error.keyValue[duplicateField];

    return NextResponse.json(
      {
        success: false,
        message: `${duplicateField} "${duplicateValue}" already exists.`,
      },
      { status: 400 }
    );
  }

  // Generic fallback
  return NextResponse.json(
    {
      success: false,
      message: "Internal Server Error",
      error:
        process.env.NODE_ENV === "development" ? error.message : undefined,
    },
    { status: 500 }
  );
}

}

export async function GET() {
  try {
    await connectDB();
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
