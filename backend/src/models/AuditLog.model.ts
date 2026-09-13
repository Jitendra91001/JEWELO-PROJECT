import mongoose, { Document, Schema, Model, Types } from "mongoose";

export interface IAuditChange {
  before?: Record<string, unknown> | null;
  after?: Record<string, unknown> | null;
}

export interface IAuditLog extends Document {
  user?: Types.ObjectId | null;
  action: string;
  module: string;
  entityId?: string | null;
  entityType?: string | null;
  ipAddress?: string;
  userAgent?: string;
  changes?: IAuditChange;
  status: "SUCCESS" | "FAILURE";
  errorMessage?: string;
  createdAt: Date;
}

const auditLogSchema = new Schema<IAuditLog>(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: "User",
      default: null,
      index: true,
    },
    action: {
      type: String,
      required: [true, "Audit action is required"],
      trim: true,
      index: true,
    },
    module: {
      type: String,
      required: [true, "Audit module is required"],
      trim: true,
      index: true,
    },
    entityId: {
      type: String,
      trim: true,
      default: null,
      index: true,
    },
    entityType: {
      type: String,
      trim: true,
      default: null,
    },
    ipAddress: {
      type: String,
      trim: true,
    },
    userAgent: {
      type: String,
      trim: true,
    },
    changes: {
      before: { type: Schema.Types.Mixed, default: null },
      after: { type: Schema.Types.Mixed, default: null },
    },
    status: {
      type: String,
      enum: ["SUCCESS", "FAILURE"],
      default: "SUCCESS",
      index: true,
    },
    errorMessage: {
      type: String,
      trim: true,
    },
  },
  {
    timestamps: { createdAt: true, updatedAt: false }, // Logs are immutable
  }
);

auditLogSchema.index({ module: 1, action: 1, createdAt: -1 });

export const AuditLog: Model<IAuditLog> =
  mongoose.models.AuditLog || mongoose.model<IAuditLog>("AuditLog", auditLogSchema);
export default AuditLog;
