import { Request } from "express";
import { AuditLog } from "../models";
import { AuthenticatedRequest } from "../types";
import { logger } from "../utils/logger";

export interface LogAuditOptions {
  action: string;
  module: string;
  entityId?: string | null;
  entityType?: string | null;
  changes?: {
    before?: Record<string, unknown> | null;
    after?: Record<string, unknown> | null;
  };
  status?: "SUCCESS" | "FAILURE";
  errorMessage?: string;
  userId?: string | null;
}

export const logAudit = async (
  req: Request | AuthenticatedRequest,
  options: LogAuditOptions
): Promise<void> => {
  try {
    const authReq = req as AuthenticatedRequest;
    const actorId = options.userId || authReq.user?.id || null;

    const ipAddress =
      (req.headers["x-forwarded-for"] as string)?.split(",")[0] ||
      req.socket.remoteAddress ||
      "unknown";

    const userAgent = req.headers["user-agent"] || "unknown";

    await AuditLog.create({
      user: actorId,
      action: options.action,
      module: options.module,
      entityId: options.entityId || null,
      entityType: options.entityType || null,
      ipAddress,
      userAgent,
      changes: options.changes || null,
      status: options.status || "SUCCESS",
      errorMessage: options.errorMessage,
    });
  } catch (error) {
    // Fail-safe: audit log errors should never crash the main transaction
    logger.error("Failed to write audit log entry:", error);
  }
};
