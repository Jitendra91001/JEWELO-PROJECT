import { Router } from "express";
import path from "path";
import fs from "fs";
import { generatePaymentQR } from "../services/qr.service";
import prisma from "../database/db";
import { authenticate } from "../middleware/auth.middleware";
import { sendSuccess, sendError } from "../utils/response";
import { AuthenticatedRequest } from "../types";
import { getInvoiceByOrderId } from "../services/invoice.service";
import { generateInvoicePDF } from "../services/pdf.service";

const router = Router();

// Get invoice by order ID
router.get(
  "/order/:orderId",
  authenticate,
  async (req: AuthenticatedRequest, res, next) => {
    try {
      const invoice = await getInvoiceByOrderId(req.params.orderId);

      if (!invoice) {
        return sendError(res, 404, "Invoice not found");
      }

      sendSuccess(res, invoice, "Invoice fetched successfully");
    } catch (error) {
      next(error);
    }
  },
);

router.get("/:id/qr", authenticate, async (req, res, next) => {
  try {
    const invoice = await prisma.invoice.findUnique({
      where: { id: req.params.id },
    });

    if (!invoice) {
      return sendError(res, 404, "Invoice not found");
    }

    const qr = await generatePaymentQR(invoice.total);

    return res.json({
      success: true,
      qrCode: qr, // base64
    });
  } catch (error) {
    next(error);
  }
});

router.get(
  '/:id/pdf',
  authenticate,
  async (req, res, next) => {
    try {
      const invoice = await prisma.invoice.findUnique({
        where: { id: req.params.id },
        include: {
          order: {
            include: { items: true }
          }
        }
      });

      if (!invoice) {
        return res.status(404).json({ message: 'Invoice not found' });
      }

      const user = await prisma.user.findUnique({
        where: { id: invoice.userId }
      });

      const qrCode = await generatePaymentQR(invoice.total);

      const pdfPath = await generateInvoicePDF(
        invoice,
        invoice.order,
        user,
        qrCode
      );

      res.setHeader('Content-Type', 'application/pdf');
      res.sendFile(pdfPath);

    } catch (error) {
      next(error);
    }
  }
);

export default router;
