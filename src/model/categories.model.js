import mongoose from "mongoose";

const categorySchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      maxlength: 100,
    },
    description: {
      type: String,
      default: "",
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    image: {
      type: String,
    },
  },
  {
    timestamps: true,
  }
);

// Adding an index for faster searches
categorySchema.index({ name: 1 });

const CategoryModel =
  mongoose.models.Category || mongoose.model("Category", categorySchema);

export default CategoryModel;
