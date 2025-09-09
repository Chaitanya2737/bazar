import connectDB from "@/lib/db";
import UserModel from "@/model/user.model";
import { NextResponse } from "next/server";

export async function GET() {
  await connectDB();
  try {
    const users = await UserModel.find().select(
      "-review -products -referralCode -visitCount -carauselImages -termsAccepted -admin -language -joiningDate -socialMediaLinks -subscriptionPlan -password -email -videoUrl"
    );

    return NextResponse.json({ success: true, users });
  } catch (error) {
    console.error("GET /api/users error:", error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}
