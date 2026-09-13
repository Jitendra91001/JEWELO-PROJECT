import { Router } from "express";
import * as categoryController from "../controllers/category.controller";
import { requireAuth, requirePermission } from "../middlewares/rbac.middleware";
import { uploadMiddleware } from "../services/cloudinary.service";
import { PERMISSIONS } from "../constants/permissions";

const router = Router();

// Public Category Discovery
router.get("/", categoryController.getCategories);
router.get("/:id", categoryController.getCategoryById);

// Admin Category Management
router.post(
  "/",
  requireAuth(),
  requirePermission(PERMISSIONS.CATEGORY_CREATE),
  uploadMiddleware.single("image"),
  categoryController.createCategory
);

router.patch(
  "/:id",
  requireAuth(),
  requirePermission(PERMISSIONS.CATEGORY_UPDATE),
  uploadMiddleware.single("image"),
  categoryController.updateCategory
);

router.put(
  "/:id",
  requireAuth(),
  requirePermission(PERMISSIONS.CATEGORY_UPDATE),
  uploadMiddleware.single("image"),
  categoryController.updateCategory
);

router.delete(
  "/:id",
  requireAuth(),
  requirePermission(PERMISSIONS.CATEGORY_DELETE),
  categoryController.deleteCategory
);

router.put(
  "/:id/toggle",
  requireAuth(),
  requirePermission(PERMISSIONS.CATEGORY_UPDATE),
  categoryController.toggleCategoryStatus
);

export default router;
