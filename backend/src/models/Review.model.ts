import mongoose, { Document, Schema, Model, Types } from "mongoose";
import { REVIEW_STATUS } from "../constants";

export interface IAdminResponse {
  message: string;
  respondedBy?: Types.ObjectId;
  respondedAt: Date;
}

export interface IReview extends Document {
  product: Types.ObjectId;
  user: Types.ObjectId;
  order?: Types.ObjectId | null;
  rating: number;
  title?: string;
  comment: string;
  images: string[];
  status: string;
  isVerifiedBuyer: boolean;
  helpfulVotes: number;
  adminResponse?: IAdminResponse;
  createdAt: Date;
  updatedAt: Date;
}

const adminResponseSchema = new Schema<IAdminResponse>(
  {
    message: { type: String, required: true, trim: true },
    respondedBy: { type: Schema.Types.ObjectId, ref: "User" },
    respondedAt: { type: Date, default: Date.now },
  },
  { _id: false }
);

const reviewSchema = new Schema<IReview>(
  {
    product: {
      type: Schema.Types.ObjectId,
      ref: "Product",
      required: [true, "Product reference is required for review"],
      index: true,
    },
    user: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: [true, "User reference is required for review"],
      index: true,
    },
    order: {
      type: Schema.Types.ObjectId,
      ref: "Order",
      default: null,
    },
    rating: {
      type: Number,
      required: [true, "Rating is required"],
      min: [1, "Rating must be at least 1 star"],
      max: [5, "Rating cannot exceed 5 stars"],
      index: true,
    },
    title: {
      type: String,
      trim: true,
      maxlength: [100, "Review title cannot exceed 100 characters"],
    },
    comment: {
      type: String,
      required: [true, "Review comment is required"],
      trim: true,
      maxlength: [2000, "Review comment cannot exceed 2000 characters"],
    },
    images: [{ type: String, trim: true }],
    status: {
      type: String,
      enum: Object.values(REVIEW_STATUS),
      default: REVIEW_STATUS.PENDING,
      index: true,
    },
    isVerifiedBuyer: {
      type: Boolean,
      default: false,
    },
    helpfulVotes: {
      type: Number,
      default: 0,
      min: 0,
    },
    adminResponse: adminResponseSchema,
  },
  {
    timestamps: true,
  }
);

// Prevent multiple reviews on the same product by the same user unless tied to separate orders
reviewSchema.index({ product: 1, user: 1, order: 1 }, { unique: true });
reviewSchema.index({ product: 1, status: 1, createdAt: -1 });

export const Review: Model<IReview> =
  mongoose.models.Review || mongoose.model<IReview>("Review", reviewSchema);
export default Review;
