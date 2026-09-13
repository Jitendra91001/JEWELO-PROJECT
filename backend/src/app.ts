import express, { Express, Request, Response } from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import morgan from "morgan";
import path from "path";
import "express-async-errors";

import { env } from "./config/env.config";
import { corsOptions } from "./config/cors.config";
import { securityMiddleware } from "./middlewares/security.middleware";
import { notFoundHandler } from "./middlewares/notFound.middleware";
import { errorHandler } from "./middlewares/error.middleware";
import { ApiResponse } from "./utils/ApiResponse";
import apiRoutes from "./routes";

const app: Express = express();

// 1. Security & Network Middlewares
app.use(securityMiddleware);
app.use(cors(corsOptions));
app.use(cookieParser());

// 2. Body Parsers
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true, limit: "10mb" }));

// 3. HTTP Request Logging
if (env.NODE_ENV !== "test") {
  app.use(
    morgan(env.NODE_ENV === "production" ? "combined" : "dev", {
      skip: (req: Request) => req.url === "/api/health" || req.url === "/health",
    })
  );
}

// 4. Static Uploads Serving
app.use(
  "/uploads",
  (req, res, next) => {
    res.setHeader("Cross-Origin-Resource-Policy", "cross-origin");
    next();
  },
  express.static(path.resolve(process.cwd(), env.UPLOAD_DIR))
);

// 5. Health Check Endpoints
const healthHandler = (req: Request, res: Response) => {
  return ApiResponse.success(res, "Jewellery E-Commerce Maison API is operational", {
    status: "HEALTHY",
    uptime: process.uptime(),
    timestamp: new Date().toISOString(),
    environment: env.NODE_ENV,
    version: "1.0.0",
  });
};

app.get("/health", healthHandler);
app.get("/api/health", healthHandler);
app.get("/api/v1/health", healthHandler);

import { authRateLimiter, apiRateLimiter } from "./middlewares/rateLimiter.middleware";

// 6. Rate Limiting & Mount Primary API Routers
app.use("/api/v1/auth", authRateLimiter);
app.use("/api/v1", apiRateLimiter, apiRoutes);

// 7. 404 Catch-all Handler
app.use(notFoundHandler);

// 8. Global Error Handler
app.use(errorHandler);

export default app;
