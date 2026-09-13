import { Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { AuthenticatedRequest, IAuthUser } from "../types";
import { ApiError } from "../utils/ApiError";
import { env } from "../config/env.config";
import { User } from "../models/User.model";
import { USER_ROLES } from "../constants";

interface DecodedToken {
  id?: string;
  userId?: string;
  sub?: string;
  email?: string;
  role?: string;
  iat?: number;
  exp?: number;
}

export const authenticate = async (
  req: AuthenticatedRequest,
  _res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    let token: string | undefined;

    const authHeader = req.headers.authorization;
    if (authHeader && authHeader.startsWith("Bearer ")) {
      token = authHeader.substring(7);
    } else if (req.cookies && req.cookies.token) {
      token = req.cookies.token;
    }

    if (!token) {
      throw ApiError.unauthorized("Authentication required. Please provide a valid Bearer token.");
    }

    const decoded = jwt.verify(token, env.JWT_SECRET) as DecodedToken;
    const userId = decoded.id || decoded.userId || decoded.sub;

    if (!userId) {
      throw ApiError.unauthorized("Invalid token payload");
    }

    const user = await User.findById(userId).populate("role");
    if (!user || user.isDeleted) {
      throw ApiError.unauthorized("User account does not exist or has been deactivated");
    }

    if (!user.isActive) {
      throw ApiError.forbidden("Account is suspended. Please contact customer support.");
    }

    // Resolve role name
    let roleName: string = USER_ROLES.CUSTOMER;
    if (typeof user.role === "object" && user.role !== null && "code" in user.role) {
      roleName = (user.role as any).code;
    } else if (typeof user.role === "string") {
      roleName = user.role;
    }

    req.user = {
      id: user._id.toString(),
      _id: user._id,
      email: user.email,
      name: user.name,
      role: roleName,
    };

    next();
  } catch (error: any) {
    if (error.name === "JsonWebTokenError") {
      next(ApiError.unauthorized("Invalid authentication token"));
    } else if (error.name === "TokenExpiredError") {
      next(ApiError.unauthorized("Authentication token has expired"));
    } else {
      next(error);
    }
  }
};

export const authorize = (...allowedRoles: string[]) => {
  return (req: AuthenticatedRequest, _res: Response, next: NextFunction): void => {
    if (!req.user) {
      return next(ApiError.unauthorized("Authentication required"));
    }

    // SUPER_ADMIN has global privileges
    if (req.user.role === USER_ROLES.SUPER_ADMIN) {
      return next();
    }

    const hasRole = allowedRoles.some(
      (role) => role.toUpperCase() === (req.user?.role || "").toUpperCase()
    );

    if (!hasRole) {
      return next(
        ApiError.forbidden(
          `Access denied. Requires one of the following roles: [${allowedRoles.join(", ")}]`
        )
      );
    }

    next();
  };
};

export const optionalAuth = async (
  req: AuthenticatedRequest,
  _res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    let token: string | undefined;

    const authHeader = req.headers.authorization;
    if (authHeader && authHeader.startsWith("Bearer ")) {
      token = authHeader.substring(7);
    } else if (req.cookies && req.cookies.token) {
      token = req.cookies.token;
    }

    if (token) {
      try {
        const decoded = jwt.verify(token, env.JWT_SECRET) as DecodedToken;
        const userId = decoded.id || decoded.userId || decoded.sub;
        if (userId) {
          const user = await User.findById(userId);
          if (user && user.isActive && !user.isDeleted) {
            req.user = {
              id: user._id.toString(),
              _id: user._id,
              email: user.email,
              name: user.name,
              role: (user.role as any)?.code || USER_ROLES.CUSTOMER,
            };
          }
        }
      } catch {
        // Token invalid, proceed anonymously
      }
    }
    next();
  } catch (error) {
    next(error);
  }
};
