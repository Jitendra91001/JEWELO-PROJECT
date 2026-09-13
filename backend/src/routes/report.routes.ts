import { Router } from "express";
import * as reportController from "../controllers/report.controller";
import { requireAuth, requireRole, requirePermission } from "../middlewares/rbac.middleware";
import { USER_ROLES } from "../constants";
import { PERMISSIONS } from "../constants/permissions";

const router = Router();

router.use(
  requireAuth(),
  requireRole(USER_ROLES.ADMIN, USER_ROLES.MANAGER, USER_ROLES.SUPER_ADMIN),
  requirePermission(PERMISSIONS.REPORT_VIEW)
);

router.get("/sales", reportController.getSalesReport);
router.get("/revenue", reportController.getRevenueReport);
router.get("/products", reportController.getProductReport);
router.get("/categories", reportController.getCategoryReport);
router.get("/customers", reportController.getCustomerReport);
router.get("/inventory", reportController.getInventoryReport);
router.get("/orders", reportController.getOrderReport);
router.get("/returns", reportController.getReturnReport);

export default router;
