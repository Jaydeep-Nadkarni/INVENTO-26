import mongoose from "mongoose";

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI, {
      retryWrites: false
    });
    console.log("MongoDB connected ✅");
  } catch (error) {
    console.error("MongoDB connection failed ❌", error.message);
    if (process.env.NODE_ENV === 'production') {
      process.exit(1);
    } else {
      console.error("[DEV] Please check your .env file and ensure MONGO_URI is set. API routes will fail until connected.");
    }
  }
};

export default connectDB;