import { Router } from "express";
import {
  createProduct,
  getProductById,
  getProductBySlug,
  getProducts,
  updateProduct,
  deleteProduct,
  getFeaturedProducts,
} from "../services/product.service";
import {
  authenticate,
  authorize,
  optionalAuth,
} from "../middleware/auth.middleware";
import { validate, validateQuery } from "../middleware/validation.middleware";
import {
  createProductSchema,
  updateProductSchema,
  filterProductSchema,
} from "../schemas/product.schema";
import { AuthenticatedRequest } from "../types";
import {
  sendSuccess,
  sendPaginatedSuccess,
  sendError,
} from "../utils/response";
import { uploadDriver } from "../config/multer";

const router = Router();

// Get all products with filters
router.get("/", validateQuery(filterProductSchema), async (req, res, next) => {
  try {
    const result = await getProducts(req.query as any);
    sendPaginatedSuccess(
      res,
      result.products,
      result.total,
      result.page,
      result.limit,
      "Products retrieved successfully",
    );
  } catch (error) {
    console.log("errororororor");
    next(error);
  }
});

// Get featured products
router.get("/featured/list", optionalAuth, async (req, res, next) => {
  try {
    const limit = parseInt(req.query.limit as string) || 8;
    const products = await getFeaturedProducts(limit);
    sendSuccess(res, products, "Featured products retrieved successfully");
  } catch (error) {
    next(error);
  }
});

// Get product by slug
router.get("/:slug", optionalAuth, async (req, res, next) => {
  try {
    const product = await getProductBySlug(req.params.slug);
    sendSuccess(res, product, "Product retrieved successfully");
  } catch (error) {
    next(error);
  }
});

// Create product (Admin only)
router.post(
  "/",
  authenticate,
  authorize("ADMIN"),
  uploadDriver.single("thumbnail"),
  // validate(createProductSchema),
  async (req: AuthenticatedRequest, res, next) => {

    try {
      if (req.file) {
        req.body.thumbnail = `/uploads/${req.file.filename}`;
      }

      const payload = {
        ...req.body,
        price: Number(req.body.price),
        discountPrice: Number(req.body.discountPrice),
        cost: Number(req.body.cost),
        quantity: Number(req.body.quantity),
        isActive: Boolean(req.body.isActive),
        isFeatured: Boolean(req.body.isFeatured),
      };
      const product = await createProduct(payload);
      sendSuccess(res, product, "Product created successfully", 201);
    } catch (error) {
      next(error);
    }
  },
);

// Update product (Admin only)
router.put(
  "/:id",
  authenticate,
  authorize("ADMIN"),
  uploadDriver.single("thumbnail"),
  // validate(updateProductSchema),
  async (req: AuthenticatedRequest, res, next) => {
    try {
      if (req.file) {
        req.body.thumbnail = `/uploads/product/${req.file.filename}`;
      }
      const payload = {
        ...req.body,
        price: Number(req.body.price),
        discountPrice: Number(req.body.discountPrice),
        cost: Number(req.body.cost),
        weight:Number(req.body.weight),
        quantity: Number(req.body.quantity),
        isActive: Boolean(req.body.isActive),
        isFeatured: Boolean(req.body.isFeatured),
      };
      const product = await updateProduct(req.params.id, payload);
      sendSuccess(res, product, "Product updated successfully");
    } catch (error) {
      next(error);
    }
  },
);

// Delete product (Admin only)
router.delete(
  "/:id",
  authenticate,
  authorize("ADMIN"),
  async (req: AuthenticatedRequest, res, next) => {
    try {
      await deleteProduct(req.params.id);
      sendSuccess(res, null, "Product deleted successfully");
    } catch (error) {
      next(error);
    }
  },
);

export default router;
