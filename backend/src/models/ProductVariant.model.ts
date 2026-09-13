import mongoose, { Document, Schema, Model, Types } from "mongoose";

export interface IProductVariant extends Document {
  product: Types.ObjectId;
  sku: string;
  metalColor?: "Yellow Gold" | "White Gold" | "Rose Gold" | "Dual Tone";
  metalPurity?: string;
  size?: string; // e.g. Ring Size 12, 14, 16 or Bracelet length 7 inch
  additionalPrice: number;
  finalPrice: number;
  stock: number;
  images: string[];
  isDefault: boolean;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const productVariantSchema = new Schema<IProductVariant>(
  {
    product: {
      type: Schema.Types.ObjectId,
      ref: "Product",
      required: [true, "Parent product reference is mandatory"],
      index: true,
    },
    sku: {
      type: String,
      required: [true, "Variant SKU is mandatory"],
      unique: true,
      uppercase: true,
      trim: true,
      index: true,
    },
    metalColor: {
      type: String,
      enum: ["Yellow Gold", "White Gold", "Rose Gold", "Dual Tone"],
    },
    metalPurity: {
      type: String,
    },
    size: {
      type: String,
      trim: true,
    },
    additionalPrice: {
      type: Number,
      default: 0,
    },
    finalPrice: {
      type: Number,
      default: 0,
    },
    stock: {
      type: Number,
      default: 1,
      min: [0, "Stock cannot be negative"],
    },
    images: [{ type: String }],
    isDefault: {
      type: Boolean,
      default: false,
    },
    isActive: {
      type: Boolean,
      default: true,
      index: true,
    },
  },
  {
    timestamps: true,
  }
);

productVariantSchema.index({ product: 1, metalColor: 1, size: 1 }, { unique: true });

export const ProductVariant: Model<IProductVariant> =
  mongoose.models.ProductVariant ||
  mongoose.model<IProductVariant>("ProductVariant", productVariantSchema);
export default ProductVariant;
