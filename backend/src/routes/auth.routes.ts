import { Router, Response } from 'express';
import {
  register,
  login,
  forgotPassword,
  resetPassword,
  verifyEmail,
  updateProfile,
  getProfile,
} from '../services/auth.service';
import { authenticate } from '../middleware/auth.middleware';
import { validate, validateQuery } from '../middleware/validation.middleware';
import {
  registerSchema,
  loginSchema,
  forgotPasswordSchema,
  resetPasswordSchema,
  updateProfileSchema,
} from '../schemas/auth.schema';
import { AuthenticatedRequest } from '../types';
import { sendSuccess, sendError } from '../utils/response';

const router = Router();

// Register
router.post('/register', validate(registerSchema), async (req, res, next) => {
  try {
    const result = await register(req.body);
    sendSuccess(res, result, 'Registration successful', 201);
  } catch (error) {
    next(error);
  }
});

// Login
router.post('/login', validate(loginSchema), async (req, res, next) => {
  try {
    const result = await login(req.body);
    sendSuccess(res, result, 'Login successful');
  } catch (error) {
    next(error);
  }
});

// Verify Email
router.get('/verify-email', async (req, res, next) => {
  try {
    const token = req.query.token as string;
    if (!token) {
      return sendError(res, 400, 'Token is required');
    }
    const result = await verifyEmail(token);
    sendSuccess(res, result, 'Email verified successfully');
  } catch (error) {
    next(error);
  }
});

// Forgot Password
router.post(
  '/forgot-password',
  validate(forgotPasswordSchema),
  async (req, res, next) => {
    try {
      const result = await forgotPassword(req.body.email);
      sendSuccess(res, result, 'Password reset email sent');
    } catch (error) {
      next(error);
    }
  }
);

// Reset Password
router.post(
  '/reset-password',
  validate(resetPasswordSchema),
  async (req, res, next) => {
    try {
      const result = await resetPassword(req.body);
      sendSuccess(res, result, 'Password reset successful');
    } catch (error) {
      next(error);
    }
  }
);

// Get Profile
router.get('/profile', authenticate, async (req: AuthenticatedRequest, res, next) => {
  try {
    if (!req.user) {
      return sendError(res, 401, 'Unauthorized');
    }
    const profile = await getProfile(req.user.id);
    sendSuccess(res, profile, 'Profile retrieved successfully');
  } catch (error) {
    next(error);
  }
});

// Update Profile
router.put(
  '/profile',
  authenticate,
  validate(updateProfileSchema),
  async (req: AuthenticatedRequest, res, next) => {
    try {
      if (!req.user) {
        return sendError(res, 401, 'Unauthorized');
      }
      const profile = await updateProfile(req.user.id, req.body);
      sendSuccess(res, profile, 'Profile updated successfully');
    } catch (error) {
      next(error);
    }
  }
);

export default router;
