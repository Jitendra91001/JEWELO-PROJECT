import { Router } from 'express';
import {
  addToWishlist,
  getWishlist,
  removeFromWishlist,
  isInWishlist,
} from '../services/wishlist.service';
import { authenticate } from '../middleware/auth.middleware';
import { AuthenticatedRequest } from '../types';
import { sendSuccess, sendError } from '../utils/response';
import { z } from 'zod';
import { validate } from '../middleware/validation.middleware';

const router = Router();

const addToWishlistSchema = z.object({
  productId: z.string().min(1, 'Product ID is required'),
});

// Add to wishlist
router.post(
  '/',
  authenticate,
  validate(addToWishlistSchema),
  async (req: AuthenticatedRequest, res, next) => {
    try {
      if (!req.user) {
        return sendError(res, 401, 'Unauthorized');
      }
      const item = await addToWishlist(req.user.id, req.body.productId);
      sendSuccess(res, item, 'Item added to wishlist', 201);
    } catch (error) {
      next(error);
    }
  }
);

// Get wishlist
router.get('/', authenticate, async (req: AuthenticatedRequest, res, next) => {
  try {
    if (!req.user) {
      return sendError(res, 401, 'Unauthorized');
    }
    const wishlist = await getWishlist(req.user.id);
    sendSuccess(res, wishlist, 'Wishlist retrieved successfully');
  } catch (error) {
    next(error);
  }
});

// Check if in wishlist
router.get(
  '/:productId/check',
  authenticate,
  async (req: AuthenticatedRequest, res, next) => {
    try {
      if (!req.user) {
        return sendError(res, 401, 'Unauthorized');
      }
      const inWishlist = await isInWishlist(req.user.id, req.params.productId);
      sendSuccess(res, { inWishlist }, 'Wishlist check completed');
    } catch (error) {
      next(error);
    }
  }
);

// Remove from wishlist
router.delete(
  '/:productId',
  authenticate,
  async (req: AuthenticatedRequest, res, next) => {
    try {
      if (!req.user) {
        return sendError(res, 401, 'Unauthorized');
      }
      await removeFromWishlist(req.user.id, req.params.productId);
      sendSuccess(res, null, 'Item removed from wishlist');
    } catch (error) {
      next(error);
    }
  }
);

export default router;
