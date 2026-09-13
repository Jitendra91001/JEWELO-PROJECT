import mongoose, { Document, Schema, Model, Types } from "mongoose";
import { USER_ROLES } from "../constants";

export interface IRole extends Document {
  code: string; // e.g., "SUPER_ADMIN", "ADMIN", "MANAGER", "STAFF", "USER"
  name: string;
  description?: string;
  permissions: Types.ObjectId[];
  isSystem: boolean; // Protects built-in system roles from accidental deletion
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const roleSchema = new Schema<IRole>(
  {
    code: {
      type: String,
      required: [true, "Role code is required"],
      unique: true,
      trim: true,
      uppercase: true,
      index: true,
    },
    name: {
      type: String,
      required: [true, "Role name is required"],
      trim: true,
    },
    description: {
      type: String,
      trim: true,
    },
    permissions: [
      {
        type: Schema.Types.ObjectId,
        ref: "Permission",
      },
    ],
    isSystem: {
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

export const Role: Model<IRole> = mongoose.models.Role || mongoose.model<IRole>("Role", roleSchema);
export default Role;
