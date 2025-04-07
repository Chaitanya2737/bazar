import mongoose from "mongoose";

const referralCodeSchema = new mongoose.Schema(
  {
    code: {
      type: String,
      required: true,
      unique: true,
    },
    referredBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    referredUsers: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    ],
    discount: {
      type: Number,
      default: 0,
    },
    status: {
      type: String,
      enum: ["active", "expired", "redeemed"],
      default: "active",
    },
  },
  {
    timestamps: true,
  }
);

const ReferralCodeModel =
  mongoose.models.ReferralCode || mongoose.model("ReferralCode", referralCodeSchema);

export default ReferralCodeModel;
