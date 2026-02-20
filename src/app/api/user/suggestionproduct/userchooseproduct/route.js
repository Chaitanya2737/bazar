import UserProductModel from "@/model/product/user.product.model";
import SuggestionProduct from "@/model/suggestionproduct/suggestion.model";
import { NextResponse } from "next/server";

export async function POST(request) {
  try {
    const body = await request.json();
    const { userId, selectedProducts } = body;

    console.log(userId, selectedProducts);

    const suggestItems = await SuggestionProduct.find({
      _id: { $in: selectedProducts },
    });

    console.log(selectedProducts)

     const newProducts = suggestItems.map((item) => ({
      title: item.title,
      description: item.description,
      thumbnail: item.images,
      category_Id: item.category_Id,
      userId: userId,
    }));

    // ✅ 3. Insert into Product collection
    await UserProductModel.insertMany(newProducts);

    return NextResponse.json({ status: 200 });
  } catch (error) {
    console.log(error)
    return NextResponse.json({ status: 400  , error});

  }
}
