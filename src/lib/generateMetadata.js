import connectDB from "@/lib/db";
import UserModel from "@/model/user.model";
import CategoryModel from "@/model/categories.model";

export async function getUserBySlug(slug) {
  await connectDB();

  const user = await UserModel.findOne({ slug })
    .populate("categories", "name")
    .select(
      "businessName slug bio businessIcon carauselImages categories businessLocation"
    )
    .lean();

    console.log(user);

  if (!user) return null;

  // Extract category names for SEO or keywords
//   const categoryNames = user.categories?.map((cat) => cat.name) || [];

  return { user };
}
