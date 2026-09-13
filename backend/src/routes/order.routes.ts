import { Router } from "express";
import * as orderController from "../controllers/order.controller";
import { requireAuth, requirePermission } from "../middlewares/rbac.middleware";
import { PERMISSIONS } from "../constants/permissions";

const router = Router();

router.use(requireAuth());

// Customer Order Endpoints
router.post("/", requirePermission(PERMISSIONS.ORDER_CREATE), orderController.createOrder);
router.get("/", orderController.getMyOrders);
router.get("/user/my-orders", orderController.getMyOrders); // Alias for frontend compatibility

router.get("/:id", orderController.getOrderById);
router.get("/:id/invoice", orderController.downloadOrderInvoice);

router.post("/:id/cancel", requirePermission(PERMISSIONS.ORDER_CANCEL), orderController.cancelOrder);
router.put("/:id/cancel", requirePermission(PERMISSIONS.ORDER_CANCEL), orderController.cancelOrder); // Alias

// Admin Order Management
router.patch(
  "/:id/status",
  requirePermission(PERMISSIONS.ORDER_UPDATE),
  orderController.updateOrderStatus
);

export default router;
