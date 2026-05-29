import mongoose from "mongoose";

const connectDB = async (req, res) => {
  try {
    await mongoose.connect(process.env.MONGO_URL);
    console.log("DATABASE CONNECTED SUCCESSFULLY ✅");
  } catch (err) {
    console.log("Error Connecting Database ❌", err);
    process.exit(1);
  }
};

export default connectDB;
