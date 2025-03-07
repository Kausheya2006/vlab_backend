import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config();

const connectDb = async () => {
  try {
    if (!process.env.MONGO_URI) {
      throw new Error("❌ MONGO_URI is missing in .env file!");
    }

    console.log("🔄 Connecting to MongoDB...");
    const mongoUri = process.env.MONGO_URI;
const conn = await mongoose.connect(mongoUri);



    console.log("✅ MongoDB Connected!");
  } catch (error) {
    console.error("❌ MongoDB Connection Error:", error.message);
    process.exit(1);
  }
};

export default connectDb;
