import { Router } from 'express';
import {
  addToCart,
  getCart,
  updateCartItemQuantity,
  removeFromCart,
  clearCart,
} from '../services/cart.service';
import { authenticate } from '../middleware/auth.middleware';
import { AuthenticatedRequest } from '../types';
import { sendSuccess, sendError } from '../utils/response';
import { z } from 'zod';
import { validate } from '../middleware/validation.middleware';

const router = Router();

const addToCartSchema = z.object({
  productId: z.string().min(1, 'Product ID is required'),
  quantity: z.number().int().positive('Quantity must be at least 1'),
});

const updateQuantitySchema = z.object({
  quantity: z.number().int().nonnegative('Quantity must be at least 0'),
});

// Add to cart
router.post(
  '/',
  authenticate,
  validate(addToCartSchema),
  async (req: AuthenticatedRequest, res, next) => {
    try {
      if (!req.user) {
        return sendError(res, 401, 'Unauthorized');
      }
      const cartItem = await addToCart(req.user.id, req.body.productId, req.body.quantity);
      sendSuccess(res, cartItem, 'Item added to cart', 201);
    } catch (error) {
      next(error);
    }
  }
);

// Get cart
router.get('/', authenticate, async (req: AuthenticatedRequest, res, next) => {
  try {
    if (!req.user) {
      return sendError(res, 401, 'Unauthorized');
    }
    const cart = await getCart(req.user.id);
    sendSuccess(res, cart, 'Cart retrieved successfully');
  } catch (error) {
    next(error);
  }
});

// Update cart item quantity
router.patch(
  '/:productId',
  authenticate,
  validate(updateQuantitySchema),
  async (req: AuthenticatedRequest, res, next) => {
    try {
      if (!req.user) {
        return sendError(res, 401, 'Unauthorized');
      }
      const cartItem = await updateCartItemQuantity(
        req.user.id,
        req.params.productId,
        req.body.quantity
      );
      sendSuccess(res, cartItem, 'Cart item updated successfully');
    } catch (error) {
      next(error);
    }
  }
);

// Remove from cart
router.delete(
  '/:productId',
  authenticate,
  async (req: AuthenticatedRequest, res, next) => {
    try {
      if (!req.user) {
        return sendError(res, 401, 'Unauthorized');
      }
      await removeFromCart(req.user.id, req.params.productId);
      sendSuccess(res, null, 'Item removed from cart');
    } catch (error) {
      next(error);
    }
  }
);

// Clear cart
router.delete('/', authenticate, async (req: AuthenticatedRequest, res, next) => {
  try {
    if (!req.user) {
      return sendError(res, 401, 'Unauthorized');
    }
    await clearCart(req.user.id);
    sendSuccess(res, null, 'Cart cleared successfully');
  } catch (error) {
    next(error);
  }
});

export default router;
