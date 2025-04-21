import { v2 as cloudinary } from "cloudinary";

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME || "dp8evydam",
  api_key: process.env.CLOUDINARY_API_KEY || "591652925595255",
  api_secret: process.env.CLOUDINARY_API_SECRET || "hvHhjSg8Hf4LUfpDyJ9T_E42HoE",
});

export default cloudinary;
