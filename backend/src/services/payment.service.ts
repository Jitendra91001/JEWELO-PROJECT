import crypto from "crypto";
import { Order, Payment } from "../models";
import { ApiError } from "../utils/ApiError";
import { PAYMENT_STATUS } from "../constants";

export interface CreatePaymentIntentParams {
  orderId: string;
  amount: number;
  currency: string;
  customerEmail?: string;
}

export interface VerifyPaymentParams {
  orderId: string;
  transactionId: string;
  gatewaySignature?: string;
  paymentMethod?: string;
}

export interface IPaymentGateway {
  name: string;
  createOrder(params: CreatePaymentIntentParams): Promise<{ gatewayOrderId: string; amount: number; currency: string }>;
  verifySignature(params: VerifyPaymentParams): Promise<boolean>;
}

/**
 * Universal Mock/Dev Gateway Adaptor (Ready for Razorpay / Stripe plug-in)
 */
class DevGatewayAdapter implements IPaymentGateway {
  name = "DEV_MOCK_GATEWAY";

  async createOrder(params: CreatePaymentIntentParams) {
    const gatewayOrderId = `gwy_order_${Date.now()}_${crypto.randomBytes(4).toString("hex")}`;
    return {
      gatewayOrderId,
      amount: params.amount,
      currency: params.currency,
    };
  }

  async verifySignature(_params: VerifyPaymentParams) {
    // In production with Razorpay:
    // const hmac = crypto.createHmac("sha256", env.RAZORPAY_SECRET);
    // hmac.update(params.orderId + "|" + params.transactionId);
    // return hmac.digest("hex") === params.gatewaySignature;
    return true;
  }
}

const currentGateway: IPaymentGateway = new DevGatewayAdapter();

export const initiatePaymentOrder = async (orderId: string, amount: number, currency: string = "INR") => {
  const order = await Order.findById(orderId);
  if (!order) {
    throw ApiError.notFound("Order not found");
  }

  const gatewayResponse = await currentGateway.createOrder({
    orderId: order._id.toString(),
    amount: amount || order.totalAmount,
    currency,
  });

  const payment = await Payment.create({
    order: order._id,
    user: order.user,
    transactionId: `TXN-PENDING-${Date.now()}`,
    paymentGateway: currentGateway.name,
    paymentMethod: order.paymentMethod,
    amount: gatewayResponse.amount,
    currency,
    status: PAYMENT_STATUS.PENDING,
    gatewayOrderId: gatewayResponse.gatewayOrderId,
  });

  return {
    paymentId: payment._id,
    gatewayOrderId: gatewayResponse.gatewayOrderId,
    amount: payment.amount,
    currency: payment.currency,
  };
};

export const verifyPaymentServerSide = async (params: VerifyPaymentParams) => {
  const { orderId, transactionId, gatewaySignature, paymentMethod } = params;

  const isValid = await currentGateway.verifySignature(params);
  if (!isValid) {
    throw ApiError.badRequest("Invalid payment signature / verification failure");
  }

  const order = await Order.findById(orderId);
  if (!order) {
    throw ApiError.notFound("Associated order not found");
  }

  const payment = await Payment.findOneAndUpdate(
    { order: order._id },
    {
      $set: {
        transactionId: transactionId || `TXN-COMPLETED-${Date.now()}`,
        status: PAYMENT_STATUS.COMPLETED,
        gatewaySignature,
        paymentMethod: paymentMethod || order.paymentMethod,
        paidAt: new Date(),
      },
    },
    { new: true, upsert: true }
  );

  order.paymentStatus = PAYMENT_STATUS.COMPLETED;
  await order.save();

  return payment;
};