import { Router } from 'express';
import {
  createCategory,
  getCategoryById,
  getCategoryBySlug,
  getAllCategories,
  updateCategory,
  deleteCategory,
} from '../services/category.service';
import { authenticate, authorize } from '../middleware/auth.middleware';
import { validate } from '../middleware/validation.middleware';
import { z } from 'zod';
import { sendSuccess, sendError } from '../utils/response';
import { AuthenticatedRequest } from '../types';
import { uploadDriver } from '../config/multer';
import fs from 'fs';

const router = Router();

const createCategorySchema = z.object({
  name: z.string().min(2),
  slug: z.string().min(2),
  description: z.string().optional(),
  image: z
    .string()
    .optional()
    .refine((val) => !val || val.startsWith("/uploads/"), {
      message: "Image must be a valid upload path",
    }),
});

const updateCategorySchema = createCategorySchema.partial();

// Get all categories
router.get('/', async (req, res, next) => {
  try {
    const onlyActive = req.query.active === 'true';
    const categories = await getAllCategories(onlyActive);
    sendSuccess(res, categories, 'Categories retrieved successfully');
  } catch (error) {
    next(error);
  }
});

// Get category by slug
router.get('/:slug', async (req, res, next) => {
  try {
    const category = await getCategoryBySlug(req.params.slug);
    sendSuccess(res, category, 'Category retrieved successfully');
  } catch (error) {
    next(error);
  }
});

// Create category (Admin only)
router.post(
  "/",
  authenticate,
  authorize("ADMIN"),
  uploadDriver.single("image"), // ✅ use this
  validate(createCategorySchema),
  async (req: AuthenticatedRequest, res, next) => {
    try {
      if (!req.user) {
        return sendError(res, 401, "Unauthorized");
      }

      console.log("Body:", req.body);
      console.log("File:", req.file);

      // ✅ Save correct path
      if (req.file) {
        req.body.image = `/uploads/category/${req.file.filename}`;
      }

      const category = await createCategory(req.body);

      sendSuccess(res, category, "Category created successfully", 201);
    } catch (error: any) {
      // ❗ delete file if error
      if (req.file) {
        fs.unlinkSync(req.file.path);
      }
      next(error);
    }
  }
);

// Update category (Admin only)
router.put(
  '/:id',
  authenticate,
  authorize('ADMIN'),
  uploadDriver.single("image"),
  validate(updateCategorySchema),
  async (req: AuthenticatedRequest, res, next) => {
    try {
      if (req.file) {
        req.body.image = `/uploads/${req.file.filename}`;
      }
      const category = await updateCategory(req.params.id, req.body);
      sendSuccess(res, category, 'Category updated successfully');
    } catch (error) {
      next(error);
    }
  }
);

// Delete category (Admin only)
router.delete(
  '/:id',
  authenticate,
  authorize('ADMIN'),
  async (req: AuthenticatedRequest, res, next) => {
    try {
      await deleteCategory(req.params.id);
      sendSuccess(res, null, 'Category deleted successfully');
    } catch (error) {
      next(error);
    }
  }
);

export default router;
