import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import connectDB from "@/lib/db";
import UserProductModel from "@/model/product/user.product.model";
import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";

export const DELETE = async (request) => {
  try {
    await connectDB();

    const { pid } = await request.json();
    if (!pid) {
      return NextResponse.json(
        { success: false, message: "Product ID is required" },
        { status: 400 }
      );
    }

    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json(
        { success: false, message: "User is not authenticated" },
        { status: 401 }
      );
    }

    // ✅ Ensure product belongs to the logged-in user
    const deletedProduct = await UserProductModel.findOneAndDelete({
      _id: pid,
      userId: session.user.id,
    });

    if (!deletedProduct) {
      return NextResponse.json(
        { success: false, message: "Product not found or not authorized" },
        { status: 404 }
      );
    }

    return NextResponse.json(
      {
        success: true,
        message: "Product deleted successfully",
        product: deletedProduct,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("❌ Error deleting product:", error);
    return NextResponse.json(
      { success: false, message: "Internal server error" },
      { status: 500 }
    );
  }
};
