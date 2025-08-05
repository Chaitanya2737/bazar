import connectDB from "@/lib/db";
import CategoryModel from "@/model/categories.model";
import { NextResponse } from "next/server";

export async function GET(request) {
  try {
    await connectDB(); // Ensure DB connection is established

   const findCategories = await CategoryModel.find();

    return NextResponse.json({ 
        msg: "Data retrieved successfully", 
        data: findCategories 
      }, 
      { status: 200 });
  } catch (error) {
    console.log(error);
    return NextResponse.json({ msg: "Internal Server Error" }, { status: 500 });
  }
}
