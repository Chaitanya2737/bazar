import mongoose from "mongoose";

const suggestionProductSchema = new mongoose.Schema(
  {
    category_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Category",
      required: true,
      index: true,
    },

    title: {
      type: String,
      required: true,
      trim: true,
    },

    description: {
      type: String,
      trim: true,
    },

    images: {
      type: String,
      required: true,
    },
  },
  { timestamps: true },
);

const SuggestionProduct =
  mongoose.models.SuggestionProduct ||
  mongoose.model("SuggestionProduct", suggestionProductSchema);

export default SuggestionProduct;
