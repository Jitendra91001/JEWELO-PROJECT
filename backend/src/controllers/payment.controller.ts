import { Response } from "express";
import { asyncHandler } from "../utils/asyncHandler";
import { ApiResponse } from "../utils/ApiResponse";
import { ApiError } from "../utils/ApiError";
import { Payment } from "../models";
import { AuthenticatedRequest } from "../types";
import { initiatePaymentOrder, verifyPaymentServerSide } from "../services/payment.service";

export const createPaymentIntent = asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
  const { orderId, invoiceId, amount, currency } = req.body;
  const targetId = orderId || invoiceId;

  if (!targetId) {
    throw ApiError.badRequest("Order ID is mandatory to initiate a payment");
  }

  const result = await initiatePaymentOrder(targetId, Number(amount), currency || "INR");
  return ApiResponse.created(res, "Payment intent initialized", result);
});

export const verifyPayment = asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
  const { orderId, transactionId, gatewaySignature, paymentMethod } = req.body;

  if (!orderId) {
    throw ApiError.badRequest("Order ID is required for payment verification");
  }

  const payment = await verifyPaymentServerSide({
    orderId,
    transactionId,
    gatewaySignature,
    paymentMethod,
  });

  return ApiResponse.success(res, "Payment successfully verified and settled", payment);
});

export const getPaymentByOrderId = asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
  const { orderId } = req.params;

  const payment = await Payment.findOne({ order: orderId }).populate("order", "orderNumber totalAmount paymentStatus");
  if (!payment) {
    throw ApiError.notFound("Payment record not found for this order");
  }

  return ApiResponse.success(res, "Payment details retrieved successfully", payment);
});
