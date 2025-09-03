import mongoose from "mongoose";
const userSchema = new mongoose.Schema({
  businessName: {
    type: String,
    required: true,
    unique: true,
    minlength: 2,
    maxlength: 45,
  },
  slug: { type: String, unique: true, required: true },

  handlerName: {
    type: String,
    required: true,
  },
  bio: {
    type: String,
  },
  videoUrl: {
    type: [String],
    default: [],
  },

  mobileNumber: {
    type: [String],
    required: [true, "At least one mobile number is required."],
    validate: {
      validator: function (arr) {
        return arr.length >= 1 && arr.length <= 4; // Allow 1 to 4 numbers
      },
      message: "A user must have at least 1 and at most 4 mobile numbers.",
    },
  },
  gstNumber: {
    type: String,
    default: null,
  },
  email: {
    type: String,
  },
  password: {
    type: String,
    required: true,
  },
  role: {
    type: String,
    enum: ["user", "business", "admin"],
    default: "user",
  },
  subscriptionPlan: {
    type: String,
    enum: ["basic", "premium"],
    default: "basic",
  },
  socialMediaLinks: {
    insta: { type: String, default: "" },
    youtube: { type: String, default: "" },
    facebook: { type: String, default: "" },
    x: { type: String, default: "" }, // Twitter (X)
    linkedin: { type: String, default: "" },
  },
  businessLocation: {
    type: String,
    required: true,
  },
  joiningDate: {
    type: Date,
    required: true,
    default: Date.now,
    immutable: true,
  },
  language: {
    type: String,
  },

  admin: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Admin",
  },
  businessIcon: {
    type: String,
  },
  categories: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Categories",
  },
  termsAccepted: {
    type: Boolean,
    required: true,
    default: false,
  },

  lastUpdated: {
    type: Date,
    default: Date.now,
  },

  carauselImages: {
    type: [String],
    default: [],
  },
  visitCount: {
    type: Number,
    default: 0,
  },
  referralCode: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "referral",
    unique: true,
    sparse: true, // Allows null values without uniqueness conflict
  },
  siteoffer: [
    {
      offerId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Offer",
      },
      offerStartDate: {
        type: Date,
      },
      offerExpiryDate: {
        type: Date,
      },
    },
  ],

  review: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Review",
  },

  products: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "UserProduct",
  },
});

const UserModel = mongoose.models.User || mongoose.model("User", userSchema);
export default UserModel;
