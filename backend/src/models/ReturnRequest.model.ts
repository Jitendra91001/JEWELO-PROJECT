import mongoose, { Document, Schema, Model, Types } from "mongoose";

export const RETURN_REASONS = {
  DEFECTIVE_OR_DAMAGED: "DEFECTIVE_OR_DAMAGED",
  SIZE_MISMATCH: "SIZE_MISMATCH",
  INCORRECT_ITEM: "INCORRECT_ITEM",
  NOT_AS_DESCRIBED: "NOT_AS_DESCRIBED",
  QUALITY_DISSATISFACTION: "QUALITY_DISSATISFACTION",
  OTHER: "OTHER",
} as const;

export const RETURN_STATUS = {
  REQUESTED: "REQUESTED",
  UNDER_REVIEW: "UNDER_REVIEW",
  APPROVED: "APPROVED",
  PICKUP_SCHEDULED: "PICKUP_SCHEDULED",
  PICKED_UP: "PICKED_UP",
  RECEIVED: "RECEIVED",
  INSPECTED: "INSPECTED",
  REFUND_PENDING: "REFUND_PENDING",
  REFUNDED: "REFUNDED",
  REJECTED: "REJECTED",
  CANCELLED: "CANCELLED",
} as const;

export interface IReturnItem {
  orderItem: Types.ObjectId;
  quantity: number;
  reason?: string;
}

export interface IReturnRequest extends Document {
  returnNumber: string;
  order: Types.ObjectId;
  user: Types.ObjectId;
  items: IReturnItem[];
  reasonCategory: string;
  reasonDetails: string;
  images: string[];
  status: string;
  pickupDate?: Date | null;
  refundAmount: number;
  adminNotes?: string;
  rejectionReason?: string;
  processedBy?: Types.ObjectId | null;
  createdAt: Date;
  updatedAt: Date;
}

const returnItemSchema = new Schema<IReturnItem>(
  {
    orderItem: {
      type: Schema.Types.ObjectId,
      ref: "OrderItem",
      required: true,
    },
    quantity: {
      type: Number,
      required: true,
      min: 1,
    },
    reason: {
      type: String,
      trim: true,
    },
  },
  { _id: false }
);

const returnRequestSchema = new Schema<IReturnRequest>(
  {
    returnNumber: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      index: true,
    },
    order: {
      type: Schema.Types.ObjectId,
      ref: "Order",
      required: [true, "Order reference is required for return"],
      index: true,
    },
    user: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: [true, "User reference is required for return"],
      index: true,
    },
    items: [returnItemSchema],
    reasonCategory: {
      type: String,
      enum: Object.values(RETURN_REASONS),
      required: [true, "Reason category is required"],
    },
    reasonDetails: {
      type: String,
      required: [true, "Detailed reason is required"],
      trim: true,
      maxlength: [1000, "Reason details cannot exceed 1000 characters"],
    },
    images: [{ type: String, trim: true }],
    status: {
      type: String,
      enum: Object.values(RETURN_STATUS),
      default: RETURN_STATUS.REQUESTED,
      index: true,
    },
    pickupDate: {
      type: Date,
      default: null,
    },
    refundAmount: {
      type: Number,
      default: 0,
      min: 0,
    },
    adminNotes: {
      type: String,
      trim: true,
    },
    rejectionReason: {
      type: String,
      trim: true,
    },
    processedBy: {
      type: Schema.Types.ObjectId,
      ref: "User",
      default: null,
    },
  },
  {
    timestamps: true,
  }
);

returnRequestSchema.index({ order: 1, user: 1 });
returnRequestSchema.index({ status: 1, createdAt: -1 });

returnRequestSchema.pre("validate", function (next) {
  if (!this.returnNumber) {
    const randomHex = Math.floor(100000 + Math.random() * 900000);
    const year = new Date().getFullYear();
    this.returnNumber = `RET-${year}-${randomHex}`;
  }
  next();
});

export const ReturnRequest: Model<IReturnRequest> =
  mongoose.models.ReturnRequest ||
  mongoose.model<IReturnRequest>("ReturnRequest", returnRequestSchema);
export default ReturnRequest;
