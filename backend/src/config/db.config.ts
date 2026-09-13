import mongoose from "mongoose";
import { env } from "./env.config";
import { logger } from "../utils/logger";

let isConnected = false;

export const connectDB = async (): Promise<void> => {
  if (isConnected) {
    logger.info("Using existing MongoDB connection");
    return;
  }

  const mongoUri = env.DATABASE_URL;

  // Connection event handlers
  mongoose.connection.on("connected", () => {
    isConnected = true;
    logger.info("🍃 MongoDB connected successfully");
  });

  mongoose.connection.on("error", (err) => {
    logger.error("❌ MongoDB connection error:", err);
  });

  mongoose.connection.on("disconnected", () => {
    isConnected = false;
    logger.warn("⚠️  MongoDB disconnected. Attempting reconnection...");
  });

  try {
    await mongoose.connect(mongoUri, {
      maxPoolSize: 20,
      serverSelectionTimeoutMS: 10000,
      socketTimeoutMS: 45000,
      autoIndex: env.NODE_ENV !== "production", // Enable index creation in dev
    });
  } catch (error) {
    logger.error("Failed to connect to MongoDB on startup:", error);
    process.exit(1);
  }
};

export const disconnectDB = async (): Promise<void> => {
  if (!isConnected) return;
  try {
    await mongoose.disconnect();
    isConnected = false;
    logger.info("MongoDB disconnected gracefully");
  } catch (error) {
    logger.error("Error during MongoDB disconnect:", error);
  }
};

export default connectDB;
