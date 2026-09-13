import { Router } from "express";
import { invoiceController } from "../controllers";
import { authenticate } from "../middlewares/auth.middleware";

const router = Router();

router.get("/order/:orderId", authenticate, invoiceController.getInvoiceByOrderId);
router.get("/:invoiceId/qr", authenticate, invoiceController.getInvoiceQr);
router.get("/:invoiceId/pdf", authenticate, invoiceController.downloadInvoicePdf);

export default router;
