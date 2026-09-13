import { Router } from "express";
import * as productController from "../controllers/product.controller";
import { requireAuth, requirePermission } from "../middlewares/rbac.middleware";
import { uploadMiddleware } from "../services/cloudinary.service";
import { PERMISSIONS } from "../constants/permissions";

const router = Router();

// Public Product Discovery
router.get("/", productController.getProducts);
router.get("/featured", productController.getFeaturedProducts);
router.get("/new-arrivals", productController.getNewArrivals);
router.get("/best-sellers", productController.getBestSellers);
router.get("/search", productController.searchProducts);
router.get("/:id", productController.getProductById);
router.get("/:id/certificate", productController.downloadProductCertificate);

// Admin Product Management
router.post(
  "/",
  requireAuth(),
  requirePermission(PERMISSIONS.PRODUCT_CREATE),
  uploadMiddleware.array("images", 10),
  productController.createProduct
);

router.patch(
  "/:id",
  requireAuth(),
  requirePermission(PERMISSIONS.PRODUCT_UPDATE),
  uploadMiddleware.array("images", 10),
  productController.updateProduct
);

router.put(
  "/:id",
  requireAuth(),
  requirePermission(PERMISSIONS.PRODUCT_UPDATE),
  uploadMiddleware.array("images", 10),
  productController.updateProduct
);

router.delete(
  "/:id",
  requireAuth(),
  requirePermission(PERMISSIONS.PRODUCT_DELETE),
  productController.deleteProduct
);

// Granular PATCH Endpoints
router.patch(
  "/:id/status",
  requireAuth(),
  requirePermission(PERMISSIONS.PRODUCT_UPDATE),
  productController.updateProductStatus
);

router.patch(
  "/:id/featured",
  requireAuth(),
  requirePermission(PERMISSIONS.PRODUCT_UPDATE),
  productController.toggleProductFeatured
);

router.patch(
  "/:id/bestseller",
  requireAuth(),
  requirePermission(PERMISSIONS.PRODUCT_UPDATE),
  productController.toggleProductBestseller
);

router.patch(
  "/:id/new-arrival",
  requireAuth(),
  requirePermission(PERMISSIONS.PRODUCT_UPDATE),
  productController.toggleProductNewArrival
);

export default router;
