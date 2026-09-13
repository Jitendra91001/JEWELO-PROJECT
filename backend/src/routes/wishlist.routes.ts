import { Router } from "express";
import * as wishlistController from "../controllers/wishlist.controller";
import { requireAuth } from "../middlewares/rbac.middleware";

const router = Router();

router.use(requireAuth());

router.get("/", wishlistController.getWishlist);
router.delete("/", wishlistController.clearWishlist);

router.post("/:productId", wishlistController.addToWishlist);
router.post("/", wishlistController.addToWishlist); // Alias with body.productId

router.delete("/:productId", wishlistController.removeFromWishlist);

export default router;
