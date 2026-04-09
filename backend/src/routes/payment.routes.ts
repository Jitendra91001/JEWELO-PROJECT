import { Router } from 'express';
import { authenticate } from '../middleware/auth.middleware';
import { createPayment } from '../services/payment.service';
import { sendSuccess } from '../utils/response';
import { AuthenticatedRequest } from '../types';

const router = Router();

// Create payment (Receipt)
router.post(
  '/',
  authenticate,
  async (req: AuthenticatedRequest, res, next) => {
    try {
      const { invoiceId, amount, method, transactionId } = req.body;

      const payment = await createPayment(invoiceId, {
        amount,
        method,
        transactionId,
      });

      sendSuccess(res, payment, 'Payment successful');
    } catch (error) {
      next(error);
    }
  }
);

export default router;