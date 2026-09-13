import { Router } from "express";
import * as returnController from "../controllers/return.controller";
import { requireAuth, requirePermission } from "../middlewares/rbac.middleware";
import { uploadMiddleware } from "../services/cloudinary.service";
import { PERMISSIONS } from "../constants/permissions";

const router = Router();

router.use(requireAuth());

// Customer Return Endpoints
router.post("/", uploadMiddleware.array("images", 5), returnController.createReturnRequest);
router.get("/", returnController.getCustomerReturns);
router.get("/:id", returnController.getReturnById);
router.post("/:id/cancel", returnController.cancelReturnRequest);

// Admin Return Endpoints
router.get("/admin", requirePermission(PERMISSIONS.RETURN_VIEW), returnController.getAdminReturns);

router.patch(
  "/:id/approve",
  requirePermission(PERMISSIONS.RETURN_APPROVE),
  returnController.approveReturn
);

router.patch(
  "/:id/reject",
  requirePermission(PERMISSIONS.RETURN_REJECT),
  returnController.rejectReturn
);

router.patch(
  "/:id/received",
  requirePermission(PERMISSIONS.RETURN_APPROVE),
  returnController.markReturnReceived
);

router.patch(
  "/:id/refund",
  requirePermission(PERMISSIONS.ORDER_REFUND),
  returnController.processReturnRefund
);

export default router;
