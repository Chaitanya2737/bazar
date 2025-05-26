import mongoose from "mongoose";

let isConnected = false; // global variable

const connectDB = async () => {
  if (isConnected) {
    console.log("DB already connected");
    return;
  }
  try {
    await mongoose.connect(process.env.DB_STRING, {
      useNewUrlParser: true,
      useUnifiedTopology: true, 
    });
    

    isConnected = true;
    console.log("DB connected successfully");
  } catch (error) {
    console.error("DB connection failed:", error);
    process.exit(1);
  }
};

export default connectDB;