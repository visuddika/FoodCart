import mongoose from "mongoose";

export const connectDB = async () => {
  try {
    console.log("ℹ️ Connecting to MongoDB...");

    await mongoose.connect(process.env.MONGO_URI);

    console.log("✅ MongoDB connected");

    return true;

  } catch (error) {
    console.error("❌ MongoDB connection error:", error.message);
    return false;
  }
};