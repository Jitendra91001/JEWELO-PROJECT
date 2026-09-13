import { Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { AuthenticatedRequest } from "../types";
import { ApiError } from "../utils/ApiError";
import { env } from "../config/env.config";
import { User, Role } from "../models";
import { USER_ROLES } from "../constants";
import { logAudit } from "../services/audit.service";

interface TokenPayload {
  id?: string;
  userId?: string;
  sub?: string;
  email?: string;
  role?: string;
}

/**
 * requireAuth()
 * Strict authentication middleware. Verifies JWT from Authorization Bearer header or cookie,
 * loads the active user from MongoDB, populates role and granular permissions.
 */
export const requireAuth = () => {
  return async (req: AuthenticatedRequest, _res: Response, next: NextFunction): Promise<void> => {
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

      const decoded = jwt.verify(token, env.JWT_SECRET) as TokenPayload;
      const userId = decoded.id || decoded.userId || decoded.sub;

      if (!userId) {
        throw ApiError.unauthorized("Invalid token payload structure");
      }

      const user = await User.findById(userId).populate({
        path: "role",
        populate: { path: "permissions", model: "Permission" },
      });

      if (!user || user.isDeleted) {
        throw ApiError.unauthorized("User account does not exist or has been deleted");
      }

      if (!user.isActive) {
        throw ApiError.forbidden("Your account has been deactivated. Please contact concierge.");
      }

      // Extract role code and all permission codes
      let roleCode = USER_ROLES.CUSTOMER;
      const permissionCodes: string[] = [];

      if (user.role && typeof user.role === "object") {
        const roleObj = user.role as any;
        roleCode = roleObj.code || USER_ROLES.CUSTOMER;

        if (Array.isArray(roleObj.permissions)) {
          for (const perm of roleObj.permissions) {
            if (typeof perm === "object" && perm !== null && perm.code) {
              permissionCodes.push(perm.code);
            } else if (typeof perm === "string") {
              permissionCodes.push(perm);
            }
          }
        }
      }

      req.user = {
        id: user._id.toString(),
        _id: user._id,
        email: user.email,
        name: user.name,
        role: roleCode,
        permissions: permissionCodes,
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
};

/**
 * requireRole(...roles: string[])
 * Enforces role membership.
 * Note: SUPER_ADMIN bypasses all role checks automatically.
 */
export const requireRole = (...roles: string[]) => {
  return (req: AuthenticatedRequest, _res: Response, next: NextFunction): void => {
    if (!req.user) {
      return next(ApiError.unauthorized("Authentication required before evaluating roles"));
    }

    // 8. SUPER_ADMIN bypass where appropriate
    if (req.user.role === USER_ROLES.SUPER_ADMIN) {
      return next();
    }

    const userRole = (req.user.role || "").toUpperCase();
    const hasRole = roles.some((r) => r.toUpperCase() === userRole);

    if (!hasRole) {
      logAudit(req, {
        action: "ROLE_ACCESS_DENIED",
        module: "RBAC",
        status: "FAILURE",
        errorMessage: `Access denied. Requires one of roles: [${roles.join(", ")}], but user holds "${req.user.role}"`,
      });

      return next(
        ApiError.forbidden(
          `Access denied. You do not have the required role to access this resource. Required: [${roles.join(", ")}]`
        )
      );
    }

    next();
  };
};

/**
 * requirePermission(...permissions: string[])
 * Enforces granular permissions (e.g. "product.create", "category.update").
 * SUPER_ADMIN bypasses all permission checks.
 */
export const requirePermission = (...permissions: string[]) => {
  return (req: AuthenticatedRequest, _res: Response, next: NextFunction): void => {
    if (!req.user) {
      return next(ApiError.unauthorized("Authentication required before evaluating permissions"));
    }

    // SUPER_ADMIN has god-mode privileges across the system
    if (req.user.role === USER_ROLES.SUPER_ADMIN) {
      return next();
    }

    const userPermissions = new Set(req.user.permissions || []);
    const missingPermissions = permissions.filter((perm) => !userPermissions.has(perm));

    if (missingPermissions.length > 0) {
      logAudit(req, {
        action: "PERMISSION_ACCESS_DENIED",
        module: "ACL",
        status: "FAILURE",
        errorMessage: `User missing permission: ${missingPermissions.join(", ")}`,
      });

      return next(
        ApiError.forbidden(
          `Access denied. Missing required permission(s): [${missingPermissions.join(", ")}]`
        )
      );
    }

    next();
  };
};

/**
 * preventSelfRoleModification
 * Prevents non-super-admins from changing their own role or privileges.
 */
export const preventSelfRoleModification = (
  req: AuthenticatedRequest,
  _res: Response,
  next: NextFunction
): void => {
  const targetUserId = req.params.id;
  const currentUserId = req.user?.id;

  if (targetUserId === currentUserId && req.user?.role !== USER_ROLES.SUPER_ADMIN) {
    throw ApiError.forbidden("You cannot modify your own administrative role or account status");
  }

  next();
};

/**
 * preventSuperAdminDelete
 * Prevents deletion or blocking of SUPER_ADMIN accounts.
 */
export const preventSuperAdminDelete = async (
  req: AuthenticatedRequest,
  _res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const targetUserId = req.params.id;
    const targetUser = await User.findById(targetUserId).populate("role");

    if (targetUser) {
      const roleCode = (targetUser.role as any)?.code || targetUser.role;
      if (roleCode === USER_ROLES.SUPER_ADMIN) {
        throw ApiError.forbidden("SUPER_ADMIN accounts cannot be deleted, blocked, or downgraded");
      }
    }

    next();
  } catch (error) {
    next(error);
  }
};
