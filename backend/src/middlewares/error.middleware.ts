import { Request, Response, NextFunction } from "express";
import { ApiError } from "../utils/ApiError";
import { HTTP_STATUS } from "../constants";
import { env } from "../config/env.config";
import { logger } from "../utils/logger";
import { ZodError } from "zod";

export const errorHandler = (
  err: any,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  let error = err;

  // Handle Mongoose Bad ObjectId (CastError)
  if (err.name === "CastError") {
    const message = `Invalid ${err.path}: ${err.value}`;
    error = ApiError.badRequest(message);
  }

  // Handle Mongoose Validation Error
  if (err.name === "ValidationError") {
    const errors = Object.values(err.errors || {}).map((val: any) => ({
      field: val.path,
      message: val.message,
    }));
    error = ApiError.unprocessable("Validation Error", errors);
  }

  // Handle MongoDB Duplicate Key Error (Code 11000)
  if (err.code === 11000) {
    const field = Object.keys(err.keyValue || {})[0] || "field";
    const value = err.keyValue ? err.keyValue[field] : "value";
    const message = `Duplicate value entered for '${field}': '${value}'. Must be unique.`;
    error = ApiError.conflict(message);
  }

  // Handle Zod Validation Error
  if (err instanceof ZodError) {
    const formattedErrors = err.errors.map((e) => ({
      field: e.path.join("."),
      message: e.message,
    }));
    error = ApiError.unprocessable("Input Validation Failed", formattedErrors);
  }

  // Handle JWT Errors
  if (err.name === "JsonWebTokenError") {
    error = ApiError.unauthorized("Invalid token. Please authenticate again.");
  }

  if (err.name === "TokenExpiredError") {
    error = ApiError.unauthorized("Authentication token expired. Please login again.");
  }

  // If not already an ApiError, normalize to ApiError
  if (!(error instanceof ApiError)) {
    const statusCode = error.statusCode || HTTP_STATUS.INTERNAL_SERVER_ERROR;
    const message = error.message || "Internal Server Error";
    error = new ApiError(statusCode, message, [], err.stack);
  }

  // Log error in non-production or for 500s
  if (error.statusCode >= 500) {
    logger.error(`[${req.method} ${req.originalUrl}] Server Error:`, {
      message: error.message,
      stack: error.stack,
    });
  } else {
    logger.warn(`[${req.method} ${req.originalUrl}] Operational Warning: ${error.message}`);
  }

  const response = {
    success: false,
    statusCode: error.statusCode,
    message: error.message,
    errors: error.errors?.length > 0 ? error.errors : undefined,
    ...(env.NODE_ENV === "development" ? { stack: error.stack } : {}),
    timestamp: new Date().toISOString(),
  };

  return res.status(error.statusCode).json(response);
};

export default errorHandler;
