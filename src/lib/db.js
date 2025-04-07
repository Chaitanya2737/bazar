import mongoose from "mongoose";

let isConnected = false; // global variable

const connectDB = async () => {
  if (isConnected) {
    console.log("DB already connected");
    return;
  }
  console.log(process.env.DB_STRING);
  try {
    await mongoose.connect(process.env.DB_STRING, {
      useNewUrlParser: true,
      useUnifiedTopology: true, 
    });

    isConnected = true;
    console.log("DB connected successfully");
  } catch (error) {
    console.error("DB connection failed:", error);
  }
};

export default connectDB;
