import { Router } from "express";
import * as bannerController from "../controllers/banner.controller";
import { requireAuth, requirePermission } from "../middlewares/rbac.middleware";
import { uploadMiddleware } from "../services/cloudinary.service";
import { PERMISSIONS } from "../constants/permissions";

const router = Router();

const bannerUpload = uploadMiddleware.fields([
  { name: "desktopImage", maxCount: 1 },
  { name: "mobileImage", maxCount: 1 },
]);

// Public Banners
router.get("/", bannerController.getBanners);
router.get("/:id", bannerController.getBannerById);

// Admin Banner CMS Management
router.post(
  "/",
  requireAuth(),
  requirePermission(PERMISSIONS.BANNER_CREATE),
  bannerUpload,
  bannerController.createBanner
);

router.patch(
  "/:id",
  requireAuth(),
  requirePermission(PERMISSIONS.BANNER_UPDATE),
  bannerUpload,
  bannerController.updateBanner
);

router.put(
  "/:id",
  requireAuth(),
  requirePermission(PERMISSIONS.BANNER_UPDATE),
  bannerUpload,
  bannerController.updateBanner
);

router.delete(
  "/:id",
  requireAuth(),
  requirePermission(PERMISSIONS.BANNER_DELETE),
  bannerController.deleteBanner
);

export default router;
