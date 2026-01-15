import mongoose from "mongoose";

const clientSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    phone: { type: Number, required: true },
    ranking: { type: Number, required: true },
    location: {
      type: {
        type: String,
        enum: ["Point"],
        default: "Point",
      },
      coordinates: {
        type: [Number], // [lng, lat]
        default: undefined, // optional
      },
    },
    adminId: { type: String, required: true },
    adminName: { type: String },
  },
  {
    timestamps: true,
  }
);

// 2dsphere index
clientSchema.index({ location: "2dsphere" });

const VisitedClient =
  mongoose.models.Client || mongoose.model("Client", clientSchema);

export default VisitedClient;
