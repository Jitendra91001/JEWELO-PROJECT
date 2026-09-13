import { Router } from "express";
import * as cartController from "../controllers/cart.controller";
import { requireAuth } from "../middlewares/rbac.middleware";

const router = Router();

router.use(requireAuth());

router.get("/", cartController.getCart);
router.delete("/", cartController.clearCart);

// Items management
router.post("/items", cartController.addCartItem);
router.post("/", cartController.addCartItem); // Backward-compatible alias

router.patch("/items/:itemId", cartController.updateCartItem);
router.patch("/:productId", cartController.updateCartItem); // Backward-compatible alias

router.delete("/items/:itemId", cartController.removeCartItem);
router.delete("/:productId", cartController.removeCartItem); // Backward-compatible alias

// Coupon management
router.post("/apply-coupon", cartController.applyCoupon);
router.delete("/coupon", cartController.removeCoupon);

export default router;
