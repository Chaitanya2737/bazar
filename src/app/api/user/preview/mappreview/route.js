// /api/user/preview/mappreview/route.js
import connectDB from "@/lib/db";
import UserModel from "@/model/user.model";
import CategoryModel from "@/model/categories.model"
import { NextResponse } from "next/server";

export async function POST(req) {
  await connectDB();

  try {
    const users = await UserModel.find()
      .select(
        "-review -products -slug  -siteoffer -bio -mobileNumber -gstNumber -role -referralCode -visitCount -carauselImages -termsAccepted -admin -language -joiningDate -socialMediaLinks -subscriptionPlan -password -email -videoUrl"
      )
      .populate("categories", "name")
      .lean();

    return NextResponse.json({
      success: true,
      count: users.length,
      users,
    });
  } catch (error) {
    console.error("Map preview error:", error);
    return NextResponse.json({ success: false }, { status: 500 });
  }
}


