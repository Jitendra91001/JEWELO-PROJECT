import { Router } from "express";
import * as adminController from "../controllers/admin.controller";
import * as orderController from "../controllers/order.controller";
import * as couponController from "../controllers/coupon.controller";
import * as reviewController from "../controllers/review.controller";
import * as notificationController from "../controllers/notification.controller";
import * as returnController from "../controllers/return.controller";
import { requireAuth, requireRole, requirePermission } from "../middlewares/rbac.middleware";
import { validate } from "../middlewares/validate.middleware";
import { createCouponValidator, updateCouponValidator } from "../validators/coupon.validator";
import { USER_ROLES } from "../constants";
import { PERMISSIONS } from "../constants/permissions";

const router = Router();

// Strict Admin protection for all /admin routes
router.use(requireAuth(), requireRole(USER_ROLES.ADMIN, USER_ROLES.MANAGER, USER_ROLES.SUPER_ADMIN));

// Dashboard Analytics Routes
router.get("/dashboard", requirePermission(PERMISSIONS.REPORT_VIEW), adminController.getDashboardStats);
router.get("/dashboard/revenue", requirePermission(PERMISSIONS.REPORT_VIEW), adminController.getDashboardRevenue);
router.get("/dashboard/orders", requirePermission(PERMISSIONS.REPORT_VIEW), adminController.getDashboardOrders);
router.get("/dashboard/products", requirePermission(PERMISSIONS.REPORT_VIEW), adminController.getDashboardProducts);
router.get("/dashboard/customers", requirePermission(PERMISSIONS.REPORT_VIEW), adminController.getDashboardCustomers);
router.get("/dashboard/inventory", requirePermission(PERMISSIONS.REPORT_VIEW), adminController.getDashboardInventory);

// User Management Routes
router.get("/users", requirePermission(PERMISSIONS.USER_VIEW), adminController.getUsers);
router.patch("/users/:id/role", requirePermission(PERMISSIONS.ROLE_UPDATE), adminController.updateUserRole);
router.patch("/users/:id/status", requirePermission(PERMISSIONS.USER_UPDATE), adminController.toggleUserStatus);
router.get("/roles", requirePermission(PERMISSIONS.ROLE_VIEW), adminController.getRoles);

// Admin Orders
router.get("/orders", requirePermission(PERMISSIONS.ORDER_VIEW), orderController.getOrders);
router.get("/orders/:id", requirePermission(PERMISSIONS.ORDER_VIEW), orderController.getOrderById);

// Admin Coupons
router.get("/coupons", requirePermission(PERMISSIONS.COUPON_VIEW), couponController.getCoupons);
router.post("/coupons", requirePermission(PERMISSIONS.COUPON_CREATE), validate(createCouponValidator), couponController.createCoupon);
router.put("/coupons/:id", requirePermission(PERMISSIONS.COUPON_UPDATE), validate(updateCouponValidator), couponController.updateCoupon);
router.delete("/coupons/:id", requirePermission(PERMISSIONS.COUPON_DELETE), couponController.deleteCoupon);

// Admin Reviews
router.get("/reviews", requirePermission(PERMISSIONS.REVIEW_VIEW), reviewController.getAdminReviews);

// Admin Notifications
router.get("/notifications", requirePermission(PERMISSIONS.NOTIFICATION_VIEW), notificationController.getAdminNotifications);

// Admin Returns
router.get("/returns", requirePermission(PERMISSIONS.RETURN_VIEW), returnController.getAdminReturns);
router.get("/returns/:id", requirePermission(PERMISSIONS.RETURN_VIEW), returnController.getReturnById);

export default router;
