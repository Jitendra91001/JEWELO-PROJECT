import mongoose, { Document, Schema, Model } from "mongoose";

export interface IPermission extends Document {
  name: string;
  code: string; // e.g., "product.create", "order.view", "customer.block"
  module: string; // e.g., "products", "orders", "customers", "inventory"
  description?: string;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const permissionSchema = new Schema<IPermission>(
  {
    name: {
      type: String,
      required: [true, "Permission name is required"],
      trim: true,
    },
    code: {
      type: String,
      required: [true, "Permission code is required"],
      unique: true,
      trim: true,
      lowercase: true,
      index: true,
    },
    module: {
      type: String,
      required: [true, "Module name is required"],
      trim: true,
      index: true,
    },
    description: {
      type: String,
      trim: true,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);

export const Permission: Model<IPermission> =
  mongoose.models.Permission || mongoose.model<IPermission>("Permission", permissionSchema);
export default Permission;
