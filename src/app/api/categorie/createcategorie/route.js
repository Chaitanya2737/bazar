import connectDB from "@/lib/db";
import CategoryModel from "@/model/categories.model";
import { NextResponse } from "next/server";

export async function POST(request) {
  try {
    await connectDB(); // Ensure DB connection is established

    // Extract data from the request body
    const { name, description } = await request.json();

    // Validate data
    if (!name || !description) {
      return NextResponse.json({ msg: "Name and description are required" }, { status: 400 });
    }

    // Create a new category instance
    const newCategory = new CategoryModel({
      name,
      description,
    });

    await newCategory.save();

    return NextResponse.json({ msg: "Category created successfully" }, { status: 201 });
  } catch (error) {
    console.log(error);
    return NextResponse.json({ msg: "Internal Server Error" }, { status: 500 });
  }
}
