import mongoose, { Document, Schema, Model, Types } from "mongoose";
import { PAYMENT_STATUS, PAYMENT_METHODS } from "../constants";

export interface IPayment extends Document {
  order: Types.ObjectId;
  user: Types.ObjectId;
  transactionId: string;
  paymentGateway: string;
  paymentMethod: string;
  amount: number;
  currency: string;
  status: string;
  gatewayOrderId?: string;
  gatewaySignature?: string;
  refundId?: string;
  refundAmount?: number;
  refundReason?: string;
  failureReason?: string;
  rawResponse?: Record<string, unknown>;
  paidAt?: Date;
  refundedAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}

const paymentSchema = new Schema<IPayment>(
  {
    order: {
      type: Schema.Types.ObjectId,
      ref: "Order",
      required: [true, "Order reference is required"],
      index: true,
    },
    user: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: [true, "User reference is required"],
      index: true,
    },
    transactionId: {
      type: String,
      required: [true, "Transaction ID is required"],
      unique: true,
      trim: true,
      index: true,
    },
    paymentGateway: {
      type: String,
      required: [true, "Payment gateway is required"],
      trim: true,
      index: true,
    },
    paymentMethod: {
      type: String,
      enum: Object.values(PAYMENT_METHODS),
      required: [true, "Payment method is required"],
    },
    amount: {
      type: Number,
      required: [true, "Payment amount is required"],
      min: [0, "Amount cannot be negative"],
    },
    currency: {
      type: String,
      default: "INR",
      uppercase: true,
    },
    status: {
      type: String,
      enum: Object.values(PAYMENT_STATUS),
      default: PAYMENT_STATUS.PENDING,
      index: true,
    },
    gatewayOrderId: {
      type: String,
      trim: true,
    },
    gatewaySignature: {
      type: String,
      trim: true,
    },
    refundId: {
      type: String,
      trim: true,
    },
    refundAmount: {
      type: Number,
      min: 0,
      default: 0,
    },
    refundReason: {
      type: String,
      trim: true,
    },
    failureReason: {
      type: String,
      trim: true,
    },
    rawResponse: {
      type: Schema.Types.Mixed,
      default: null,
    },
    paidAt: {
      type: Date,
    },
    refundedAt: {
      type: Date,
    },
  },
  {
    timestamps: true,
  }
);

paymentSchema.index({ order: 1, status: 1 });

export const Payment: Model<IPayment> =
  mongoose.models.Payment || mongoose.model<IPayment>("Payment", paymentSchema);
export default Payment;
