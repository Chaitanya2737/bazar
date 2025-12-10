import mongoose from "mongoose";
import { NextResponse } from "next/server";
import UserModel from "@/model/user.model";
import connectDB from "@/lib/db";

export async function POST(request) {
  try {
    await connectDB();

    const { id, page = 1, limit = 10 } = await request.json();
    if (!id)
      return NextResponse.json({ error: "Provide admin ID" }, { status: 400 });

    const skip = (page - 1) * limit;

    const adminObjectId = new mongoose.Types.ObjectId(id);

    const users = await UserModel.aggregate([
      { $match: { admin: adminObjectId } },
      { $sort: { joiningDate: -1 } },
      { $skip: skip },
      { $limit: limit },

      // Category Lookup
      {
        $lookup: {
          from: "categories",
          localField: "categories",
          foreignField: "_id",
          as: "categoryDetails",
        },
      },

      // Clean Category Data
      {
        $addFields: {
          categoryDetails: {
            $map: {
              input: "$categoryDetails",
              as: "cat",
              in: { _id: "$$cat._id", name: "$$cat.name" },
            },
          },
        },
      },

      // Final Projection
      {
        $project: {
          businessName: 1,
          handlerName: 1,
          email: 1,
          subscriptionPlan: 1,
          businessLocation: 1,
          joiningDate: 1,
          businessIcon: 1,
          mobileNumber: { $arrayElemAt: ["$mobileNumber", 0] },
          categoryDetails: 1,
        },
      },
    ]);

    // Total Count (with same filter)
    const totalUsers = await UserModel.countDocuments({ admin: adminObjectId });

    return NextResponse.json(
      {
        totalUsers,
        page,
        limit,
        users,
      },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
