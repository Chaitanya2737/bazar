import mongoose from "mongoose";
const userSchema = new mongoose.Schema({
  businessName: {
    type: String,
    required: true,
    unique: true,
    minlength: 2,
    maxlength: 45,
  },
  handlerName: {
    type: String,
    required: true,
  },
  bio: {
    type: String,
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
  // expringDate: {
  //   type: Date,
  //   required: true,
  // },
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
  componentIndexation: {
    type: [Number],
    default: [1, 2, 3, 4, 5],
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
  referralCode: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "referral",
    unique: true,
    sparse: true, // Allows null values without uniqueness conflict
  },
});

const UserModel = mongoose.models.User || mongoose.model("User", userSchema);

export default UserModel;
