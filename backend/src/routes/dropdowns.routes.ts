import { Router } from 'express';
import { authenticate, authorize } from '../middleware/auth.middleware';
import { sendSuccess } from '../utils/response';
import { AuthenticatedRequest } from '../types';
import { getDropdownData } from '../services/dropdowns.service';

const router = Router();
router.use(authenticate);
router.use(authorize('ADMIN'));

router.post('/', async (req: AuthenticatedRequest, res, next) => {
  try {
    const { types } = req.body;
    const data = await getDropdownData(types);
    sendSuccess(res, data, 'Dropdown data fetched successfully');
  } catch (error) {
    next(error);
  }
});

export default router;