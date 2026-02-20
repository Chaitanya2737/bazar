import connectDB from "@/lib/db";
import SuggestionProduct from "@/model/suggestionproduct/suggestion.model";
import { NextResponse } from "next/server";
import mongoose from "mongoose";

export async function POST(request) {
  try {
    await connectDB();

    const { category_Id } = await request.json();

    if (!mongoose.Types.ObjectId.isValid(category_Id)) {
      return NextResponse.json(
        { success: false, message: "Invalid category_Id" },
        { status: 400 },
      );
    }

    const products = await SuggestionProduct.aggregate([
      { $match: { category_id: new mongoose.Types.ObjectId(category_Id) } },
      { $sample: { size: 10} },
    ]);

    return NextResponse.json(
      { success: true, products },
      { status: 200 },
    );
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { success: false, message: "Server Error" },
      { status: 500 },
    );
  }
}
