import { Router } from 'express';
import {
  createAddress,
  getUserAddresses,
  getAddressById,
  updateAddress,
  deleteAddress,
  getDefaultAddress,
} from '../services/address.service';
import { authenticate } from '../middleware/auth.middleware';
import { validate } from '../middleware/validation.middleware';
import { z } from 'zod';
import { AuthenticatedRequest } from '../types';
import { sendSuccess, sendError } from '../utils/response';

const router = Router();

const createAddressSchema = z.object({
  street: z.string().min(1, 'Street is required'),
  city: z.string().min(1, 'City is required'),
  state: z.string().min(1, 'State is required'),
  zipCode: z.string().min(1, 'Zip code is required'),
  country: z.string().min(1, 'Country is required'),
  isDefault: z.boolean().optional(),
});

const updateAddressSchema = createAddressSchema.partial();

// Get all user addresses
router.get('/', authenticate, async (req: AuthenticatedRequest, res, next) => {
  try {
    if (!req.user) {
      return sendError(res, 401, 'Unauthorized');
    }
    const addresses = await getUserAddresses(req.user.id);
    sendSuccess(res, addresses, 'Addresses retrieved successfully');
  } catch (error) {
    next(error);
  }
});

// Get default address
router.get(
  '/default',
  authenticate,
  async (req: AuthenticatedRequest, res, next) => {
    try {
      if (!req.user) {
        return sendError(res, 401, 'Unauthorized');
      }
      const address = await getDefaultAddress(req.user.id);
      sendSuccess(res, address, 'Default address retrieved successfully');
    } catch (error) {
      next(error);
    }
  }
);

// Get address by ID
router.get(
  '/:id',
  authenticate,
  async (req: AuthenticatedRequest, res, next) => {
    try {
      if (!req.user) {
        return sendError(res, 401, 'Unauthorized');
      }
      const address = await getAddressById(req.params.id, req.user.id);
      sendSuccess(res, address, 'Address retrieved successfully');
    } catch (error) {
      next(error);
    }
  }
);

// Create address
router.post(
  '/',
  authenticate,
  validate(createAddressSchema),
  async (req: AuthenticatedRequest, res, next) => {
    try {
      if (!req.user) {
        return sendError(res, 401, 'Unauthorized');
      }
      const address = await createAddress(req.user.id, req.body);
      sendSuccess(res, address, 'Address created successfully', 201);
    } catch (error) {
      next(error);
    }
  }
);

// Update address
router.put(
  '/:id',
  authenticate,
  validate(updateAddressSchema),
  async (req: AuthenticatedRequest, res, next) => {
    try {
      if (!req.user) {
        return sendError(res, 401, 'Unauthorized');
      }
      const address = await updateAddress(req.params.id, req.user.id, req.body);
      sendSuccess(res, address, 'Address updated successfully');
    } catch (error) {
      next(error);
    }
  }
);

// Delete address
router.delete(
  '/:id',
  authenticate,
  async (req: AuthenticatedRequest, res, next) => {
    try {
      if (!req.user) {
        return sendError(res, 401, 'Unauthorized');
      }
      await deleteAddress(req.params.id, req.user.id);
      sendSuccess(res, null, 'Address deleted successfully');
    } catch (error) {
      next(error);
    }
  }
);

export default router;
