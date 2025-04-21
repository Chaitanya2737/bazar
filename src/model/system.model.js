import mongoose from "mongoose";

const systemSchema = new mongoose.Schema(
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
      default: "system",
      enum: ["system"], // ensure this can't be used for regular users/admins
    },
    permissions: {
      type: [String], // like ['read:any', 'write:any']
      default: [],
    },
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);

const SystemUserModel =
  mongoose.models.SystemUser || mongoose.model("SystemUser", systemSchema);

export default SystemUserModel;
