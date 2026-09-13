import { Router } from "express";
import { requireAuth, requireRole } from "../middlewares/rbac.middleware";
import { ApiResponse } from "../utils/ApiResponse";
import { AuthenticatedRequest } from "../types";
import { getDropdownData } from "../services/dropdowns.service";

const router = Router();
router.use(requireAuth());
router.use(requireRole("ADMIN"));

router.post("/", async (req: AuthenticatedRequest, res, next) => {
  try {
    const { types } = req.body;
    const data = await getDropdownData(types);
    return ApiResponse.success(res, "Dropdown data fetched successfully", data);
  } catch (error) {
    next(error);
  }
});

export default router;