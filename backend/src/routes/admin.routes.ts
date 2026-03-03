import { Router } from 'express';
import {
  getAllUsers,
  getUserById,
  updateUserRole,
  toggleUserStatus,
  deleteUser,
  getUserStats,
} from '../services/user.service';
import { format } from 'date-fns';
import {
  getAllCoupons,
  createCoupon,
  updateCoupon,
  deleteCoupon,
} from '../services/coupon.service';
import { authenticate, authorize } from '../middleware/auth.middleware';
import { validate } from '../middleware/validation.middleware';
import { z } from 'zod';
import { AuthenticatedRequest } from '../types';
import { sendSuccess, sendPaginatedSuccess, sendError } from '../utils/response';

const router = Router();

// Apply admin middleware to all routes
router.use(authenticate);
router.use(authorize('ADMIN'));

// ==================== USER MANAGEMENT ====================

// Get all users
router.get('/users', async (req: AuthenticatedRequest, res, next) => {
  try {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;
    const search = req.query.search as string | undefined;
    const role = req.query.role as string | undefined;

    const result = await getAllUsers(page, limit, search, role);
    sendPaginatedSuccess(
      res,
      result.users,
      result.total,
      result.page,
      result.limit,
      'Users retrieved successfully'
    );
  } catch (error) {
    next(error);
  }
});

// Get user by ID
router.get('/users/:id', async (req: AuthenticatedRequest, res, next) => {
  try {
    const user = await getUserById(req.params.id);
    sendSuccess(res, user, 'User retrieved successfully');
  } catch (error) {
    next(error);
  }
});

// Update user role
router.patch(
  '/users/:id/role',
  validate(
    z.object({
      role: z.enum(['USER', 'ADMIN']),
    })
  ),
  async (req: AuthenticatedRequest, res, next) => {
    try {
      const user = await updateUserRole(req.params.id, req.body.role);
      sendSuccess(res, user, 'User role updated successfully');
    } catch (error) {
      next(error);
    }
  }
);

// Toggle user status
router.patch(
  '/users/:id/status',
  async (req: AuthenticatedRequest, res, next) => {
    try {
      const user = await toggleUserStatus(req.params.id);
      sendSuccess(res, user, 'User status toggled successfully');
    } catch (error) {
      next(error);
    }
  }
);

// Delete user
router.delete('/users/:id', async (req: AuthenticatedRequest, res, next) => {
  try {
    await deleteUser(req.params.id);
    sendSuccess(res, null, 'User deleted successfully');
  } catch (error) {
    next(error);
  }
});

// Get user stats
router.get('/stats/users', async (req: AuthenticatedRequest, res, next) => {
  try {
    const stats = await getUserStats();
    sendSuccess(res, stats, 'User statistics retrieved successfully');
  } catch (error) {
    next(error);
  }
});

// ==================== COUPON MANAGEMENT ====================

const createCouponSchema = z.object({
  code: z.string().min(1, 'Coupon code is required'),
  description: z.string().optional(),
  discountType: z.enum(['PERCENTAGE', 'FIXED']),
  discountValue: z.number().positive('Discount value must be positive'),
  minPurchase: z.number().nonnegative().optional(),
  maxDiscount: z.number().positive().optional(),
  usageLimit: z.number().int().positive().optional(),
  validFrom: z.string().datetime(),
  validUpto: z.string().datetime(),
});

const updateCouponSchema = createCouponSchema.partial();

// Get all coupons
router.get('/coupons', async (req: AuthenticatedRequest, res, next) => {
  try {
    const onlyActive = req.query.active === 'true';
    const coupons = await getAllCoupons(onlyActive);
    sendSuccess(res, coupons, 'Coupons retrieved successfully');
  } catch (error) {
    next(error);
  }
});

// Create coupon
router.post(
  '/coupons',
  validate(createCouponSchema),
  async (req: AuthenticatedRequest, res, next) => {
    try {
      const data = {
        ...req.body,
        validFrom: new Date(req.body.validFrom),
        validUpto: new Date(req.body.validUpto),
      };
      const coupon = await createCoupon(data);
      sendSuccess(res, coupon, 'Coupon created successfully', 201);
    } catch (error) {
      next(error);
    }
  }
);

// Update coupon
router.put(
  '/coupons/:id',
  validate(updateCouponSchema),
  async (req: AuthenticatedRequest, res, next) => {
    try {
      const data = {
        ...req.body,
        ...(req.body.validFrom && { validFrom: new Date(req.body.validFrom) }),
        ...(req.body.validUpto && { validUpto: new Date(req.body.validUpto) }),
      };
      const coupon = await updateCoupon(req.params.id, data);
      sendSuccess(res, coupon, 'Coupon updated successfully');
    } catch (error) {
      next(error);
    }
  }
);

// Delete coupon
router.delete('/coupons/:id', async (req: AuthenticatedRequest, res, next) => {
  try {
    await deleteCoupon(req.params.id);
    sendSuccess(res, null, 'Coupon deleted successfully');
  } catch (error) {
    next(error);
  }
});

export default router;
