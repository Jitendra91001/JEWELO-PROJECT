import http from "http";
import app from "./app";
import { env } from "./config/env.config";
import { connectDB, disconnectDB } from "./config/db.config";
import { logger } from "./utils/logger";

const server = http.createServer(app);

const startServer = async () => {
  try {
    // 1. Establish MongoDB Connection
    await connectDB();

    // 2. Start HTTP Server
    server.listen(env.PORT, () => {
      logger.info(`
💎══════════════════════════════════════════════════════💎
   JEWELO Luxury Jewellery E-Commerce API Engine
   Port: ${env.PORT}
   Environment: ${env.NODE_ENV}
   Database: MongoDB (Mongoose ODM)
   Health: http://localhost:${env.PORT}/api/health
💎══════════════════════════════════════════════════════💎
      `);
    });
  } catch (error) {
    logger.error("❌ Fatal startup error encountered:", error);
    process.exit(1);
  }
};

// Graceful Shutdown Handler
const handleGracefulShutdown = async (signal: string) => {
  logger.warn(`🛑 Received ${signal}. Starting graceful shutdown...`);

  if (server) {
    server.close(async () => {
      logger.info("🔒 Closed out remaining active HTTP connections.");
      await disconnectDB();
      logger.info("👋 Server process exiting cleanly.");
      process.exit(0);
    });

    // Force close if graceful shutdown takes longer than 10 seconds
    setTimeout(() => {
      logger.error("⚠️ Forced shutdown initiated due to timeout.");
      process.exit(1);
    }, 10000);
  } else {
    await disconnectDB();
    process.exit(0);
  }
};

process.on("SIGINT", () => handleGracefulShutdown("SIGINT"));
process.on("SIGTERM", () => handleGracefulShutdown("SIGTERM"));

process.on("uncaughtException", (error) => {
  logger.error("💥 Uncaught Exception detected:", error);
  handleGracefulShutdown("uncaughtException");
});

process.on("unhandledRejection", (reason) => {
  logger.error("💥 Unhandled Promise Rejection detected:", reason);
  handleGracefulShutdown("unhandledRejection");
});

startServer();

export default server;
