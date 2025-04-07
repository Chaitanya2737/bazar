import mongoose from "mongoose";

const adminSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
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
    createdAt: {
      type: Date,
      immutable: true,
      default: Date.now,
    },
    validationExpiresAt: {
      type: Date,
    },
    payments: [
      {
        user: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "User",
          required: true,
        },
        amount: {
          type: Number,
          required: true,
        },
        paymentMethod: {
          type: String,
          required: true,
          enum: ["credit_card", "debit_card", "paypal", "upi", "net_banking"],
        },
        transactionId: {
          type: String,
          required: true,
          unique: true,
        },
        status: {
          type: String,
          enum: ["pending", "completed", "failed"],
          default: "pending",
        },
        date: {
          type: Date,
          default: Date.now,
        },
      },
    ],
  },
  {
    timestamps: true,
  }
);

const AdminModel = mongoose.models.Admin || mongoose.model("Admin", adminSchema);

export default AdminModel;
