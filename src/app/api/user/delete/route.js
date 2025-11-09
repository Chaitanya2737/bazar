import cloudinary from "@/lib/cloudinaryConfig";
import connectDB from "@/lib/db";
import UserProductModel from "@/model/product/user.product.model";
import ReviewModel from "@/model/review/review.model";
import OfferModel from "@/model/siteoffer/user.siteoffer.model";
import UserModel from "@/model/user.model";

// 🧩 Improved publicId extractor
function extractPublicId(url) {
  if (!url) return null;
  try {
    const match = url.match(/\/upload\/(?:v\d+\/)?(.+)\.[a-zA-Z0-9]+$/);
    return match ? match[1] : null;
  } catch (error) {
    console.error("❌ Error extracting publicId:", url, error);
    return null;
  }
}

export async function DELETE(request) {
  try {
    await connectDB();
    const { slug } = await request.json();

    // 1️⃣ Find user
    const user = await UserModel.findOne({ slug });
    if (!user)
      return new Response(JSON.stringify({ message: "User not found" }), {
        status: 404,
      });

    console.log(`🧩 Found user: ${user.slug}`);

    // 2️⃣ Delete business icon
    if (user.businessIcon) {
      const publicId = extractPublicId(user.businessIcon);
      if (publicId) {
        try {
          const deleted = await cloudinary.uploader.destroy(publicId, {
            type: "upload",
            invalidate: true,
          });
          console.log(`🗑️ Deleted business icon: ${publicId}`, deleted.result);
        } catch (error) {
          console.error(`❌ Error deleting business icon ${publicId}:`, error);
        }
      }
    }

    // 3️⃣ Delete carousel images
    if (user.carauselImages?.length) {
      await Promise.all(
        user.carauselImages.map(async (url) => {
          const publicId = extractPublicId(url);
          if (!publicId) return;
          try {
            const deleted = await cloudinary.uploader.destroy(publicId, {
              type: "upload",
              invalidate: true,
            });
            console.log(`🗑️ Deleted carousel image: ${publicId}`, deleted.result);
          } catch (error) {
            console.error(`❌ Error deleting carousel image ${publicId}:`, error);
          }
        })
      );
    }

    // 4️⃣ Delete all product images
    const products = await UserProductModel.find({ userId: user._id });
    console.log(`📦 Found ${products.length} products for user.`);

    await Promise.all(
      products.map(async (product) => {
        const publicId = extractPublicId(product.thumbnail);
        if (!publicId) return;
        try {
          const deleted = await cloudinary.uploader.destroy(publicId, {
            type: "upload",
            invalidate: true,
          });
          console.log(`🗑️ Deleted product image: ${publicId}`, deleted.result);
        } catch (error) {
          console.error(`❌ Error deleting product image ${publicId}:`, error);
        }
      })
    );

    // 5️⃣ Delete resources by prefix (optional cleanup for entire folder)
    const folderPrefix = `--${user._id}/`;
    try {
      const test = await cloudinary.api.delete_resources_by_prefix(folderPrefix, {
        type: "upload",
        invalidate: true,
      });
      console.log(`🧹 Folder cleanup for prefix ${folderPrefix}`, test);
    } catch (error) {
      console.error(`⚠️ Error cleaning folder ${folderPrefix}:`, error);
    }

    // 6️⃣ Delete MongoDB entries
    await UserProductModel.deleteMany({ userId: user._id });
    await OfferModel.deleteMany({ userId: user._id });
    await ReviewModel.deleteMany({ userId: user._id });

    console.log("🗑️ Deleted all related MongoDB documents.");

    await UserModel.deleteOne({ _id: user._id });
    console.log(`🗑️ Deleted user: ${user.slug}`);

    return new Response(
      JSON.stringify({ message: "✅ User and related data deleted successfully" }),
      { status: 200 }
    );
  } catch (error) {
    console.error("🔥 DELETE /user error:", error);
    return new Response(
      JSON.stringify({ message: "Internal Server Error", error: error.message }),
      { status: 500 }
    );
  }
}