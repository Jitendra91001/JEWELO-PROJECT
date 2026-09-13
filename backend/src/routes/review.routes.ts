import { Router } from "express";
import * as reviewController from "../controllers/review.controller";
import { requireAuth, requirePermission } from "../middlewares/rbac.middleware";
import { uploadMiddleware } from "../services/cloudinary.service";
import { PERMISSIONS } from "../constants/permissions";

const router = Router();

// Public Reviews
router.get("/product/:productId", reviewController.getProductReviews);
router.get("/products/:productId/reviews", reviewController.getProductReviews);

// Customer Review Lifecycle
router.post(
  "/products/:productId/reviews",
  requireAuth(),
  uploadMiddleware.array("images", 5),
  reviewController.createReview
);

router.post(
  "/",
  requireAuth(),
  uploadMiddleware.array("images", 5),
  reviewController.createReview
);

router.patch("/:id", requireAuth(), reviewController.updateReview);
router.delete("/:id", requireAuth(), reviewController.deleteReview);

// Admin Moderation Endpoints
router.get("/", requireAuth(), requirePermission(PERMISSIONS.REVIEW_VIEW), reviewController.getAdminReviews);

router.patch(
  "/:id/approve",
  requireAuth(),
  requirePermission(PERMISSIONS.REVIEW_APPROVE),
  reviewController.approveReview
);

router.patch(
  "/:id/reject",
  requireAuth(),
  requirePermission(PERMISSIONS.REVIEW_REJECT),
  reviewController.rejectReview
);

export default router;
