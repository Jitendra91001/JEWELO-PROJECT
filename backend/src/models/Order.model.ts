import mongoose, { Document, Schema, Model, Types } from "mongoose";
import { ORDER_STATUS, PAYMENT_STATUS, PAYMENT_METHODS } from "../constants";

export interface IOrderAddressSnapshot {
  fullName: string;
  phone: string;
  addressLine1: string;
  addressLine2?: string;
  landmark?: string;
  city: string;
  state: string;
  postalCode: string;
  country: string;
}

export interface IOrderCouponSnapshot {
  code: string;
  discountType: string;
  discountValue: number;
  discountAmount: number;
}

export interface IOrder extends Document {
  orderNumber: string;
  user: Types.ObjectId;
  items: Types.ObjectId[];
  shippingAddress: IOrderAddressSnapshot;
  billingAddress: IOrderAddressSnapshot;
  orderStatus: string;
  paymentStatus: string;
  paymentMethod: string;
  currency: string;

  // Financial Breakdown
  subtotal: number;
  discountAmount: number;
  taxAmount: number;
  shippingFee: number;
  insuranceFee: number;
  totalAmount: number;

  coupon?: IOrderCouponSnapshot;

  // Shipping & Logistics
  trackingNumber?: string;
  courierPartner?: string;
  estimatedDeliveryDate?: Date;
  shippedAt?: Date;
  deliveredAt?: Date;

  // Cancellation & Returns
  cancelledAt?: Date;
  cancellationReason?: string;

  // Gifting & Custom Notes
  isGift: boolean;
  giftMessage?: string;
  specialInstructions?: string;

  statusHistory?: Array<{
    status: string;
    changedAt: Date;
    changedBy?: Types.ObjectId;
    note?: string;
  }>;

  createdBy?: Types.ObjectId;
  updatedBy?: Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

const addressSnapshotSchema = new Schema<IOrderAddressSnapshot>(
  {
    fullName: { type: String, required: true, trim: true },
    phone: { type: String, required: true, trim: true },
    addressLine1: { type: String, required: true, trim: true },
    addressLine2: { type: String, trim: true },
    landmark: { type: String, trim: true },
    city: { type: String, required: true, trim: true },
    state: { type: String, required: true, trim: true },
    postalCode: { type: String, required: true, trim: true },
    country: { type: String, required: true, default: "India", trim: true },
  },
  { _id: false }
);

const couponSnapshotSchema = new Schema<IOrderCouponSnapshot>(
  {
    code: { type: String, required: true, uppercase: true, trim: true },
    discountType: { type: String, required: true },
    discountValue: { type: Number, required: true },
    discountAmount: { type: Number, required: true },
  },
  { _id: false }
);

const orderSchema = new Schema<IOrder>(
  {
    orderNumber: {
      type: String,
      required: true,
      unique: true,
      index: true,
      trim: true,
    },
    user: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: [true, "Order must belong to a user"],
      index: true,
    },
    items: [
      {
        type: Schema.Types.ObjectId,
        ref: "OrderItem",
      },
    ],
    shippingAddress: {
      type: addressSnapshotSchema,
      required: true,
    },
    billingAddress: {
      type: addressSnapshotSchema,
      required: true,
    },
    orderStatus: {
      type: String,
      enum: Object.values(ORDER_STATUS),
      default: ORDER_STATUS.PENDING,
      index: true,
    },
    paymentStatus: {
      type: String,
      enum: Object.values(PAYMENT_STATUS),
      default: PAYMENT_STATUS.PENDING,
      index: true,
    },
    paymentMethod: {
      type: String,
      enum: Object.values(PAYMENT_METHODS),
      required: true,
    },
    currency: {
      type: String,
      default: "INR",
      uppercase: true,
    },
    subtotal: {
      type: Number,
      required: true,
      min: 0,
    },
    discountAmount: {
      type: Number,
      default: 0,
      min: 0,
    },
    taxAmount: {
      type: Number,
      default: 0,
      min: 0,
    },
    shippingFee: {
      type: Number,
      default: 0,
      min: 0,
    },
    insuranceFee: {
      type: Number,
      default: 0,
      min: 0,
    },
    totalAmount: {
      type: Number,
      required: true,
      min: 0,
    },
    coupon: couponSnapshotSchema,
    trackingNumber: {
      type: String,
      trim: true,
      index: true,
    },
    courierPartner: {
      type: String,
      trim: true,
    },
    estimatedDeliveryDate: {
      type: Date,
    },
    shippedAt: {
      type: Date,
    },
    deliveredAt: {
      type: Date,
    },
    cancelledAt: {
      type: Date,
    },
    cancellationReason: {
      type: String,
      trim: true,
    },
    isGift: {
      type: Boolean,
      default: false,
    },
    giftMessage: {
      type: String,
      trim: true,
      maxlength: 300,
    },
    specialInstructions: {
      type: String,
      trim: true,
      maxlength: 500,
    },
    statusHistory: [
      {
        status: { type: String, required: true },
        changedAt: { type: Date, default: Date.now },
        changedBy: { type: Schema.Types.ObjectId, ref: "User" },
        note: { type: String, trim: true },
      },
    ],
    createdBy: {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
    updatedBy: {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
  },
  {
    timestamps: true,
  }
);

orderSchema.index({ user: 1, orderStatus: 1 });
orderSchema.index({ createdAt: -1 });

// Helper to auto-generate luxury order number if not set
orderSchema.pre("validate", function (next) {
  if (!this.orderNumber) {
    const randomHex = Math.floor(100000 + Math.random() * 900000);
    const year = new Date().getFullYear();
    this.orderNumber = `JWL-${year}-${randomHex}`;
  }
  next();
});

export const Order: Model<IOrder> =
  mongoose.models.Order || mongoose.model<IOrder>("Order", orderSchema);
export default Order;
