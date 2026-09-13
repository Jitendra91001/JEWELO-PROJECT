import { Router } from "express";
import * as paymentController from "../controllers/payment.controller";
import { requireAuth } from "../middlewares/rbac.middleware";

const router = Router();

router.use(requireAuth());

router.post("/create", paymentController.createPaymentIntent);
router.post("/", paymentController.createPaymentIntent); // Backward compatible
router.post("/verify", paymentController.verifyPayment);
router.get("/:orderId", paymentController.getPaymentByOrderId);

export default router;