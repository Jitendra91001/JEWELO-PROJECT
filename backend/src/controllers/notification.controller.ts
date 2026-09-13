import { Response } from "express";
import { asyncHandler } from "../utils/asyncHandler";
import { ApiResponse } from "../utils/ApiResponse";
import { ApiError } from "../utils/ApiError";
import { Notification } from "../models";
import { AuthenticatedRequest } from "../types";
import { parsePaginationParams } from "../utils/pagination";

export const getCustomerNotifications = asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
  if (!req.user) throw ApiError.unauthorized("Authentication required");

  const { page, limit, skip } = parsePaginationParams(req);
  const { isRead, type } = req.query as Record<string, string>;

  const filter: any = { user: req.user.id };

  if (isRead !== undefined) {
    filter.isRead = isRead === "true";
  }

  if (type) {
    filter.type = type.toUpperCase();
  }

  const [notifications, total, unreadCount] = await Promise.all([
    Notification.find(filter).sort({ createdAt: -1 }).skip(skip).limit(limit),
    Notification.countDocuments(filter),
    Notification.countDocuments({ user: req.user.id, isRead: false }),
  ]);

  const totalPages = Math.ceil(total / limit) || 1;
  return ApiResponse.success(res, "Notifications retrieved successfully", {
    notifications,
    unreadCount,
    pagination: {
      total,
      page,
      limit,
      totalPages,
      hasNextPage: page < totalPages,
      hasPreviousPage: page > 1,
    },
  });
});

export const markNotificationAsRead = asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
  if (!req.user) throw ApiError.unauthorized("Authentication required");

  const { id } = req.params;

  const notification = await Notification.findOneAndUpdate(
    { _id: id, user: req.user.id },
    { $set: { isRead: true, readAt: new Date() } },
    { new: true }
  );

  if (!notification) {
    throw ApiError.notFound("Notification not found");
  }

  return ApiResponse.success(res, "Notification marked as read", notification);
});

export const markAllNotificationsAsRead = asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
  if (!req.user) throw ApiError.unauthorized("Authentication required");

  await Notification.updateMany(
    { user: req.user.id, isRead: false },
    { $set: { isRead: true, readAt: new Date() } }
  );

  return ApiResponse.success(res, "All notifications marked as read");
});

export const getAdminNotifications = asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
  const { page, limit, skip } = parsePaginationParams(req);
  const { type, isRead } = req.query as Record<string, string>;

  const filter: any = {};
  if (type) filter.type = type.toUpperCase();
  if (isRead !== undefined) filter.isRead = isRead === "true";

  const [notifications, total] = await Promise.all([
    Notification.find(filter).sort({ createdAt: -1 }).skip(skip).limit(limit).populate("user", "name email"),
    Notification.countDocuments(filter),
  ]);

  return ApiResponse.paginated(res, "Admin notifications retrieved successfully", notifications, page, limit, total);
});
