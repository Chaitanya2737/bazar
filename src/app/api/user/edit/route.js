import connectDB from "@/lib/db";
import UserModel from "@/model/user.model";
import { NextResponse } from "next/server";
import { authOptions } from "../../auth/[...nextauth]/route";
import { getServerSession } from "next-auth";

export async function PATCH(request) {
  try {
    await connectDB();
    const body = await request.json();
    const { userId, mobileIndex, newMobile, ...fieldsToUpdate } = body;

    if (!userId) {
      return NextResponse.json(
        { error: "User ID is required" },
        { status: 400 }
      );
    }

    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json(
        { success: false, message: "User is not authenticated" },
        { status: 401 }
      );
    }

    const filter = { _id: userId };
    let updateQuery = {};

   

    if (mobileIndex !== undefined && newMobile) {
      // 🔹 Update a specific mobile number at given index
      updateQuery = { $set: { [`mobileNumber.${mobileIndex}`]: newMobile } };
    } else if (newMobile && mobileIndex === undefined) {
      // 🔹 Push a new mobile number into the array
      updateQuery = { $push: { mobileNumber: newMobile } };
    } else {
      // 🔹 Otherwise update normal fields
      Object.keys(fieldsToUpdate).forEach((key) => {
        if (fieldsToUpdate[key] !== undefined && fieldsToUpdate[key] !== null) {
          if (!updateQuery.$set) updateQuery.$set = {};
          updateQuery.$set[key] = fieldsToUpdate[key];
        }
      });
    }

    if (Object.keys(updateQuery).length === 0) {
      return NextResponse.json(
        { error: "No valid fields provided to update" },
        { status: 400 }
      );
    }

    const updatedUser = await UserModel.findOneAndUpdate(filter, updateQuery, {
      new: true,
    });

    if (!updatedUser) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    return NextResponse.json({ success: true, user: updatedUser });
  } catch (error) {
    console.error("❌ Update error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}