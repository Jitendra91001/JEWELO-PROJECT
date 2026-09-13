import { Response } from "express";
import { asyncHandler } from "../utils/asyncHandler";
import { ApiResponse } from "../utils/ApiResponse";
import { ApiError } from "../utils/ApiError";
import { Order } from "../models";
import { AuthenticatedRequest } from "../types";

export const getInvoiceByOrderId = asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
  const { orderId } = req.params;
  const order = await Order.findById(orderId)
    .populate("items")
    .populate("user", "name email phone");

  if (!order) {
    throw ApiError.notFound("Order not found for invoice");
  }

  const invoice = {
    invoiceNumber: `INV-${order.orderNumber}`,
    invoiceDate: order.createdAt,
    orderId: order._id,
    orderNumber: order.orderNumber,
    customer: {
      name: (order.user as any)?.name || order.shippingAddress.fullName,
      email: (order.user as any)?.email,
      phone: order.shippingAddress.phone,
      shippingAddress: order.shippingAddress,
      billingAddress: order.billingAddress,
    },
    items: order.items,
    pricing: {
      subtotal: order.subtotal,
      discount: order.discountAmount,
      tax: order.taxAmount,
      shipping: order.shippingFee,
      total: order.totalAmount,
    },
    paymentStatus: order.paymentStatus,
    paymentMethod: order.paymentMethod,
  };

  return ApiResponse.success(res, "Invoice details retrieved successfully", invoice);
});

export const getInvoiceQr = asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
  const { invoiceId } = req.params;

  // UPI payment QR string standard format:
  // upi://pay?pa=jewelo@upi&pn=JEWELO&am=1000&cu=INR
  const upiString = `upi://pay?pa=jewelo@upi&pn=JEWELO%20Luxury%20Maison&cu=INR&tn=Invoice%20${invoiceId}`;

  return ApiResponse.success(res, "Payment QR retrieved successfully", {
    qrString: upiString,
    invoiceId,
  });
});

export const downloadInvoicePdf = asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
  const { invoiceId } = req.params;

  res.setHeader("Content-Type", "application/pdf");
  res.setHeader("Content-Disposition", `attachment; filename=Invoice-${invoiceId}.pdf`);

  // Basic PDF binary stream header for download
  const buffer = Buffer.from(
    `%PDF-1.4\n1 0 obj<</Type/Catalog/Pages 2 0 R>>endobj 2 0 obj<</Type/Pages/Count 1/Kids[3 0 R]>>endobj 3 0 obj<</Type/Page/MediaBox[0 0 612 792]/Parent 2 0 R/Resources<<>>>>endobj\nxref\n0 4\n0000000000 65535 f \n0000000009 00000 n \n0000000058 00000 n \n0000000115 00000 n \ntrailer<</Size 4/Root 1 0 R>>\nstartxref\n190\n%%EOF`
  );

  return res.send(buffer);
});
