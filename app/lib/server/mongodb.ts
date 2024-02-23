import mongoose, { ConnectOptions } from "mongoose";
import config from "./config";


// Replace with your MongoDB connection string

const uri = config.MONGODB_URI as string;

const connect = async () => {
  if (mongoose.connection.readyState >= 1) return;

  try {
    await mongoose.connect(uri, {});
    console.log("MongoDB connected");
  } catch (error) {
    console.error("MongoDB connection error", error);
  }
};

export default connect;
