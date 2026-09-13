import { Router } from "express";
import * as inventoryController from "../controllers/inventory.controller";
import { requireAuth, requirePermission } from "../middlewares/rbac.middleware";
import { PERMISSIONS } from "../constants/permissions";

const router = Router();

router.use(requireAuth());

router.get("/", requirePermission(PERMISSIONS.INVENTORY_VIEW), inventoryController.getInventoryList);
router.get("/:productId", requirePermission(PERMISSIONS.INVENTORY_VIEW), inventoryController.getProductInventory);
router.get("/:productId/history", requirePermission(PERMISSIONS.INVENTORY_VIEW), inventoryController.getInventoryHistory);

router.post("/adjust", requirePermission(PERMISSIONS.INVENTORY_UPDATE), inventoryController.adjustStock);
router.post("/add-stock", requirePermission(PERMISSIONS.INVENTORY_UPDATE), inventoryController.addStock);
router.post("/remove-stock", requirePermission(PERMISSIONS.INVENTORY_UPDATE), inventoryController.removeStock);

export default router;
