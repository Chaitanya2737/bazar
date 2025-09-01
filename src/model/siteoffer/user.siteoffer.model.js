import mongoose from "mongoose";

const OfferSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  title: String,
  businessName: {
    type :String,
  },
  contact: {
   type: String,
  },
  category:{
    type: String,
  },
  intervalDays: { type: Number, required: true }, // e.g., 7 days
  startDate: { type: Date, default: Date.now },
  expiryDate: { type: Date }, // auto-calculated
  isActive: { type: Boolean, default: true },
});
const OfferModel =
  mongoose.models.Offer || mongoose.model("Offer", OfferSchema);

export default OfferModel;
