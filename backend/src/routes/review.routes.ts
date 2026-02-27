import { Router } from 'express';
import {
  createReview,
  getProductReviews,
  getUserReviews,
  updateReview,
  deleteReview,
} from '../services/review.service';
import { authenticate } from '../middleware/auth.middleware';
import { validate } from '../middleware/validation.middleware';
import { z } from 'zod';
import { AuthenticatedRequest } from '../types';
import { sendSuccess, sendPaginatedSuccess, sendError } from '../utils/response';
import { upload } from '../config/multer';

const router = Router();

const createReviewSchema = z.object({
  productId: z.string().min(1, 'Product ID is required'),
  rating: z.number().int().min(1).max(5, 'Rating must be between 1 and 5'),
  title: z.string().optional(),
  comment: z.string().optional(),
});

const updateReviewSchema = z.object({
  rating: z.number().int().min(1).max(5).optional(),
  title: z.string().optional(),
  comment: z.string().optional(),
});

// Create review
router.post(
  '/',
  authenticate,
  upload.array('images', 3),
  validate(createReviewSchema),
  async (req: AuthenticatedRequest, res, next) => {
    try {
      if (!req.user) {
        return sendError(res, 401, 'Unauthorized');
      }

      if (req.files && Array.isArray(req.files)) {
        req.body.images = (req.files as Express.Multer.File[]).map(
          (f) => `/uploads/${f.filename}`
        );
      }

      const review = await createReview(req.user.id, req.body);
      sendSuccess(res, review, 'Review created successfully', 201);
    } catch (error) {
      next(error);
    }
  }
);

// Get product reviews
router.get(
  '/product/:productId',
  async (req, res, next) => {
    try {
      const page = parseInt(req.query.page as string) || 1;
      const limit = parseInt(req.query.limit as string) || 10;
      const result = await getProductReviews(req.params.productId, page, limit);
      sendPaginatedSuccess(
        res,
        result.reviews,
        result.total,
        result.page,
        result.limit,
        'Product reviews retrieved successfully'
      );
    } catch (error) {
      next(error);
    }
  }
);

// Get user reviews
router.get('/user/my-reviews', authenticate, async (req: AuthenticatedRequest, res, next) => {
  try {
    if (!req.user) {
      return sendError(res, 401, 'Unauthorized');
    }
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;
    const result = await getUserReviews(req.user.id, page, limit);
    sendPaginatedSuccess(
      res,
      result.reviews,
      result.total,
      result.page,
      result.limit,
      'User reviews retrieved successfully'
    );
  } catch (error) {
    next(error);
  }
});

// Update review
router.put(
  '/:id',
  authenticate,
  upload.array('images', 3),
  validate(updateReviewSchema),
  async (req: AuthenticatedRequest, res, next) => {
    try {
      if (!req.user) {
        return sendError(res, 401, 'Unauthorized');
      }

      if (req.files && Array.isArray(req.files)) {
        req.body.images = (req.files as Express.Multer.File[]).map(
          (f) => `/uploads/${f.filename}`
        );
      }

      const review = await updateReview(req.params.id, req.user.id, req.body);
      sendSuccess(res, review, 'Review updated successfully');
    } catch (error) {
      next(error);
    }
  }
);

// Delete review
router.delete(
  '/:id',
  authenticate,
  async (req: AuthenticatedRequest, res, next) => {
    try {
      if (!req.user) {
        return sendError(res, 401, 'Unauthorized');
      }
      await deleteReview(req.params.id, req.user.id);
      sendSuccess(res, null, 'Review deleted successfully');
    } catch (error) {
      next(error);
    }
  }
);

export default router;
