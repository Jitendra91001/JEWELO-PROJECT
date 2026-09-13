import helmet from "helmet";
import { Request, Response, NextFunction } from "express";

export const securityMiddleware = [
  helmet({
    contentSecurityPolicy: false, // Allows API responses and static assets
    crossOriginResourcePolicy: { policy: "cross-origin" },
  }),
  (req: Request, res: Response, next: NextFunction) => {
    res.setHeader("X-Content-Type-Options", "nosniff");
    res.setHeader("X-Frame-Options", "DENY");
    res.setHeader("X-XSS-Protection", "1; mode=block");
    next();
  },
];

export default securityMiddleware;
