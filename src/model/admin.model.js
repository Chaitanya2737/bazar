import mongoose from "mongoose";

const adminSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
    role: {
      type: String,
      enum: ["admin", "superadmin"],
      default: "admin",
    },
    mobileNumber: {
      type: String,
      required: [true, "Mobile number is required"],
      unique: true,
      validate: {
        validator: function (num) {
          return /^\d{10}$/.test(num); // Ensures exactly 10 digits
        },
        message: "Mobile number must be exactly 10 digits.",
      },
    },
    rewardPoints: {
      type: Number,
      default: 0,
    },
    createdAt: {
      type: Date,
      immutable: true,
      default: Date.now,
    },
  },
  {
    timestamps: true,
  }
);

const AdminModel =
  mongoose.models.Admin || mongoose.model("Admin", adminSchema);

export default AdminModel;
