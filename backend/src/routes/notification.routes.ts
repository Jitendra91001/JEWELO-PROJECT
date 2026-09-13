import { Router } from "express";
import * as notificationController from "../controllers/notification.controller";
import { requireAuth, requirePermission } from "../middlewares/rbac.middleware";
import { PERMISSIONS } from "../constants/permissions";

const router = Router();

router.use(requireAuth());

// Customer Notification Routes
router.get("/", notificationController.getCustomerNotifications);
router.patch("/read-all", notificationController.markAllNotificationsAsRead);
router.patch("/:id/read", notificationController.markNotificationAsRead);

// Admin Alerts Route
router.get(
  "/admin",
  requirePermission(PERMISSIONS.NOTIFICATION_VIEW),
  notificationController.getAdminNotifications
);

export default router;
