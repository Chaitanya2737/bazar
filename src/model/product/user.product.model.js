const { default: mongoose } = require("mongoose");

const UserProduct = new mongoose.Schema(
  {
    title: {
      type: String,
      minlength: 3,
      maxlength: 30,
    },
    description: {
      type: String,
    },
    thumbnail: {
      type: String,
      required: true,
      validate: {
        validator: function (v) {
          return /\.(jpg|jpeg|png|gif|avif)$/.test(v);
        },
        message: "Thumbnail must be a valid image URL.",
      },
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  { timestamps: true }
);

const UserProductModel =
  mongoose.models.UserProduct || mongoose.model("UserProduct", UserProduct);
export default UserProductModel;
