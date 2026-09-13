import mongoose, { Document, Schema, Model, Types } from "mongoose";
import { INVENTORY_STATUS } from "../constants";

export interface IInventoryLog {
  previousQuantity: number;
  newQuantity: number;
  difference: number;
  reason: string;
  adjustedBy?: Types.ObjectId;
  adjustedAt: Date;
}

export interface IWarehouseLocation {
  zone?: string;
  aisle?: string;
  shelf?: string;
  bin?: string;
}

export interface IInventory extends Document {
  product: Types.ObjectId;
  variant?: Types.ObjectId | null;
  sku: string;
  totalQuantity: number;
  reservedQuantity: number;
  soldQuantity: number;
  availableQuantity: number;
  safetyThreshold: number;
  warehouseLocation?: IWarehouseLocation;
  status: string;
  adjustmentLogs: IInventoryLog[];
  isDeleted: boolean;
  deletedAt?: Date | null;
  createdAt: Date;
  updatedAt: Date;
}

const inventoryLogSchema = new Schema<IInventoryLog>(
  {
    previousQuantity: { type: Number, required: true },
    newQuantity: { type: Number, required: true },
    difference: { type: Number, required: true },
    reason: { type: String, required: true, trim: true },
    adjustedBy: { type: Schema.Types.ObjectId, ref: "User" },
    adjustedAt: { type: Date, default: Date.now },
  },
  { _id: false }
);

const inventorySchema = new Schema<IInventory>(
  {
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
      index: true,
    },
    sku: {
      type: String,
      required: [true, "Inventory SKU is required"],
      trim: true,
      uppercase: true,
      index: true,
    },
    totalQuantity: {
      type: Number,
      required: [true, "Total quantity is required"],
      min: [0, "Total quantity cannot be negative"],
      default: 0,
    },
    reservedQuantity: {
      type: Number,
      min: [0, "Reserved quantity cannot be negative"],
      default: 0,
    },
    soldQuantity: {
      type: Number,
      min: [0, "Sold quantity cannot be negative"],
      default: 0,
    },
    availableQuantity: {
      type: Number,
      default: 0,
    },
    safetyThreshold: {
      type: Number,
      min: [0, "Safety threshold cannot be negative"],
      default: 5,
    },
    warehouseLocation: {
      zone: { type: String, trim: true },
      aisle: { type: String, trim: true },
      shelf: { type: String, trim: true },
      bin: { type: String, trim: true },
    },
    status: {
      type: String,
      enum: Object.values(INVENTORY_STATUS),
      default: INVENTORY_STATUS.IN_STOCK,
      index: true,
    },
    adjustmentLogs: [inventoryLogSchema],
    isDeleted: {
      type: Boolean,
      default: false,
      index: true,
    },
    deletedAt: {
      type: Date,
      default: null,
    },
  },
  {
    timestamps: true,
  }
);

// Compound Index: unique combination of product and variant
inventorySchema.index({ product: 1, variant: 1 }, { unique: true });
inventorySchema.index({ status: 1, availableQuantity: 1 });

// Automatically compute available quantity and stock status
inventorySchema.pre("validate", function (next) {
  this.availableQuantity = Math.max(0, (this.totalQuantity || 0) - (this.reservedQuantity || 0));

  if (this.totalQuantity <= 0) {
    this.status = INVENTORY_STATUS.OUT_OF_STOCK;
  } else if (this.availableQuantity <= this.safetyThreshold) {
    this.status = INVENTORY_STATUS.LOW_STOCK;
  } else {
    this.status = INVENTORY_STATUS.IN_STOCK;
  }

  next();
});

export const Inventory: Model<IInventory> =
  mongoose.models.Inventory || mongoose.model<IInventory>("Inventory", inventorySchema);
export default Inventory;
