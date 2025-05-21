import mongoose from "mongoose";

const fcmtokenSchema = new mongoose.Schema(
  {
    location: {
      latitude: { type: Number, required: false },
      longitude: { type: Number, required: false },
    },
    deviceInfo: {
      type: String,
      required: false,
      default: "Unknown Device",
      trim: true,
    },
    platform: {
      type: String,
      required: false,
      default: "Unknown Platform",
      trim: true,
    },
    token: {
      type: String,
      required: true,
      unique: true,
      index: true,
    },
    city: {
      type: String,
      required: false,
      default: "Unknown Location",
      trim: true,
    },
  },
  {
    timestamps: true,
  }
);

const FcmTokenModel =
  mongoose.models.FcmToken || mongoose.model("FcmToken", fcmtokenSchema);

export default FcmTokenModel;
