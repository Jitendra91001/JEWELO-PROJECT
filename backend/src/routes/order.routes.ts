import { Router } from 'express';
import {
  createOrder,
  getOrderById,
  getUserOrders,
  getAllOrders,
  updateOrderStatus,
  updatePaymentStatus,
} from '../services/order.service';
import { authenticate, authorize } from '../middleware/auth.middleware';
import { validate, validateQuery } from '../middleware/validation.middleware';
import {
  createOrderSchema,
  updateOrderStatusSchema,
  updatePaymentStatusSchema,
  filterOrderSchema,
} from '../schemas/order.schema';
import { AuthenticatedRequest } from '../types';
import { sendSuccess, sendPaginatedSuccess, sendError } from '../utils/response';

const router = Router();

// Create order (User)
router.post(
  '/',
  authenticate,
  validate(createOrderSchema),
  async (req: AuthenticatedRequest, res, next) => {
    try {
      if (!req.user) {
        return sendError(res, 401, 'Unauthorized');
      }
      const order = await createOrder(req.user.id, req.body);
      sendSuccess(res, order, 'Order created successfully', 201);
    } catch (error) {
      next(error);
    }
  }
);

// Get user orders
router.get('/user/my-orders', authenticate, validateQuery(filterOrderSchema), async (req: AuthenticatedRequest, res, next) => {
  try {
    if (!req.user) {
      return sendError(res, 401, 'Unauthorized');
    }
    const result = await getUserOrders(req.user.id, req.query as any);
    sendPaginatedSuccess(
      res,
      result.orders,
      result.total,
      result.page,
      result.limit,
      'User orders retrieved successfully'
    );
  } catch (error) {
    next(error);
  }
});

// Get order by ID
router.get(
  '/:id',
  authenticate,
  async (req: AuthenticatedRequest, res, next) => {
    try {
      const order = await getOrderById(req.params.id);
      
      // Check authorization
      if (order.userId !== req.user?.id && req.user?.role !== 'ADMIN') {
        return sendError(res, 403, 'Access denied');
      }

      sendSuccess(res, order, 'Order retrieved successfully');
    } catch (error) {
      next(error);
    }
  }
);

// Get all orders (Admin only)
router.get(
  '/',
  authenticate,
  authorize('ADMIN'),
  validateQuery(filterOrderSchema),
  async (req: AuthenticatedRequest, res, next) => {
    try {
      const result = await getAllOrders(req.query as any);
      sendPaginatedSuccess(
        res,
        result.orders,
        result.total,
        result.page,
        result.limit,
        'All orders retrieved successfully'
      );
    } catch (error) {
      next(error);
    }
  }
);

// Update order status (Admin only)
router.patch(
  '/:id/status',
  authenticate,
  authorize('ADMIN'),
  validate(updateOrderStatusSchema),
  async (req: AuthenticatedRequest, res, next) => {
    try {
      const order = await updateOrderStatus(req.params.id, req.body);
      sendSuccess(res, order, 'Order status updated successfully');
    } catch (error) {
      next(error);
    }
  }
);

// Update payment status (Admin only)
router.patch(
  '/:id/payment-status',
  authenticate,
  authorize('ADMIN'),
  validate(updatePaymentStatusSchema),
  async (req: AuthenticatedRequest, res, next) => {
    try {
      const order = await updatePaymentStatus(req.params.id, req.body);
      sendSuccess(res, order, 'Payment status updated successfully');
    } catch (error) {
      next(error);
    }
  }
);

export default router;
