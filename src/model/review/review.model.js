import mongoose from "mongoose";

const reviewSchema = new mongoose.Schema(
  {
    userID: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    reviews: [
      {
        title: {
          type: String,
          required: true,
        },
        description: {
          type: String,
        },
      },
    ],
  },
  {
    timestamps: true,
  }
);

const ReviewModel =
  mongoose.models.Review || mongoose.model("Review", reviewSchema);

export default ReviewModel;
