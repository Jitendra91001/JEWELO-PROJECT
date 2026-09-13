import { Request, Response, NextFunction } from "express";
import { ApiError } from "../utils/ApiError";

interface RateLimitRecord {
  count: number;
  resetTime: number;
}

const rateLimitStore = new Map<string, RateLimitRecord>();

export const rateLimiter = (options: { windowMs: number; maxRequests: number; message?: string }) => {
  const { windowMs, maxRequests, message = "Too many requests. Please try again later." } = options;

  return (req: Request, _res: Response, next: NextFunction): void => {
    const ip =
      (req.headers["x-forwarded-for"] as string)?.split(",")[0] ||
      req.socket.remoteAddress ||
      "127.0.0.1";

    const key = `${ip}:${req.baseUrl || req.path}`;
    const now = Date.now();

    const record = rateLimitStore.get(key);

    if (!record || now > record.resetTime) {
      rateLimitStore.set(key, { count: 1, resetTime: now + windowMs });
      return next();
    }

    record.count += 1;

    if (record.count > maxRequests) {
      return next(ApiError.tooManyRequests(message));
    }

    next();
  };
};

export const authRateLimiter = rateLimiter({
  windowMs: 15 * 60 * 1000, // 15 minutes
  maxRequests: 30, // 30 attempts per 15 min
  message: "Too many authentication attempts. Please wait 15 minutes before trying again.",
});

export const apiRateLimiter = rateLimiter({
  windowMs: 60 * 1000, // 1 minute
  maxRequests: 200, // 200 req/min
  message: "API rate limit exceeded. Please throttle requests.",
});
