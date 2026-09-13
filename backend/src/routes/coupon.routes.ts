import { Router } from "express";
import * as couponController from "../controllers/coupon.controller";
import { requireAuth, requirePermission } from "../middlewares/rbac.middleware";
import { optionalAuth } from "../middlewares/auth.middleware";
import { validate } from "../middlewares/validate.middleware";
import { createCouponValidator, updateCouponValidator } from "../validators/coupon.validator";
import { PERMISSIONS } from "../constants/permissions";

const router = Router();

// Customer Validation Endpoint (supports optional auth to verify per-customer usage cap)
router.post("/validate", optionalAuth, couponController.validateCoupon);

// Admin Coupon Management
router.get("/", requireAuth(), requirePermission(PERMISSIONS.COUPON_VIEW), couponController.getCoupons);
router.get("/:id", requireAuth(), requirePermission(PERMISSIONS.COUPON_VIEW), couponController.getCouponById);

router.post(
  "/",
  requireAuth(),
  requirePermission(PERMISSIONS.COUPON_CREATE),
  validate(createCouponValidator),
  couponController.createCoupon
);

router.patch(
  "/:id/status",
  requireAuth(),
  requirePermission(PERMISSIONS.COUPON_UPDATE),
  couponController.toggleCouponStatus
);

router.patch(
  "/:id",
  requireAuth(),
  requirePermission(PERMISSIONS.COUPON_UPDATE),
  validate(updateCouponValidator),
  couponController.updateCoupon
);

router.put(
  "/:id",
  requireAuth(),
  requirePermission(PERMISSIONS.COUPON_UPDATE),
  validate(updateCouponValidator),
  couponController.updateCoupon
);

router.delete(
  "/:id",
  requireAuth(),
  requirePermission(PERMISSIONS.COUPON_DELETE),
  couponController.deleteCoupon
);

export default router;
