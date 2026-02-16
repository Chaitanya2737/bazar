// /api/user/preview/mappreview/route.js
import connectDB from "@/lib/db";
import UserModel from "@/model/user.model";
import CategoryModel from "@/model/categories.model"
import { NextResponse } from "next/server";

export async function POST(req) {
  await connectDB();

  try {
    const { page = 1 } = await req.json(); // get page from request body
    const limit = 500;
    const skip = (page - 1) * limit;

    const users = await UserModel.find()
      .select(
        "-review -products -slug -handlerName  -siteoffer -bio -mobileNumber -gstNumber -role -referralCode -visitCount -carauselImages -termsAccepted -admin -language -joiningDate -socialMediaLinks -subscriptionPlan -password -email -videoUrl"
      )
      .populate("categories", "name")
      .skip(skip)
      .limit(limit)
      .lean();

    return NextResponse.json({
      success: true,
      page,
      count: users.length,
      users,
    });
  } catch (error) {
    console.error("Map preview error:", error);
    return NextResponse.json({ success: false }, { status: 500 });
  }
}


