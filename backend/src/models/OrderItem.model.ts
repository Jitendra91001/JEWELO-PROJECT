import mongoose, { Document, Schema, Model, Types } from "mongoose";

export interface IOrderItem extends Document {
  order: Types.ObjectId;
  product: Types.ObjectId;
  variant?: Types.ObjectId | null;
  productName: string;
  sku: string;
  image?: string;
  metalType?: string;
  metalPurity?: string;
  metalWeight?: number;
  diamondWeightCarat?: number;
  certificateNumber?: string;
  selectedSize?: string;
  engravingText?: string;
  quantity: number;
  unitPrice: number;
  totalPrice: number;
  createdAt: Date;
  updatedAt: Date;
}

const orderItemSchema = new Schema<IOrderItem>(
  {
    order: {
      type: Schema.Types.ObjectId,
      ref: "Order",
      required: [true, "Order reference is required"],
      index: true,
    },
    product: {
      type: Schema.Types.ObjectId,
      ref: "Product",
      required: [true, "Product reference is required"],
      index: true,
    },
    variant: {
      type: Schema.Types.ObjectId,
      ref: "ProductVariant",
      default: null,
    },
    productName: {
      type: String,
      required: [true, "Product name snapshot is required"],
      trim: true,
    },
    sku: {
      type: String,
      required: [true, "SKU snapshot is required"],
      trim: true,
      uppercase: true,
    },
    image: {
      type: String,
      trim: true,
    },
    metalType: {
      type: String,
      trim: true,
    },
    metalPurity: {
      type: String,
      trim: true,
    },
    metalWeight: {
      type: Number,
      min: 0,
    },
    diamondWeightCarat: {
      type: Number,
      min: 0,
    },
    certificateNumber: {
      type: String,
      trim: true,
    },
    selectedSize: {
      type: String,
      trim: true,
    },
    engravingText: {
      type: String,
      trim: true,
    },
    quantity: {
      type: Number,
      required: true,
      min: [1, "Quantity must be at least 1"],
      default: 1,
    },
    unitPrice: {
      type: Number,
      required: true,
      min: 0,
    },
    totalPrice: {
      type: Number,
      required: true,
      min: 0,
    },
  },
  {
    timestamps: true,
  }
);

orderItemSchema.pre("validate", function (next) {
  if (this.unitPrice && this.quantity) {
    this.totalPrice = this.unitPrice * this.quantity;
  }
  next();
});

export const OrderItem: Model<IOrderItem> =
  mongoose.models.OrderItem || mongoose.model<IOrderItem>("OrderItem", orderItemSchema);
export default OrderItem;
