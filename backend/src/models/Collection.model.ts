import mongoose, { Document, Schema, Model, Types } from "mongoose";

export interface ICollection extends Document {
  name: string;
  slug: string;
  description?: string;
  bannerImage: string;
  thumbnailImage?: string;
  products?: Types.ObjectId[];
  isFeatured: boolean;
  status: "ACTIVE" | "INACTIVE" | "ARCHIVED" | "UPCOMING" | "active" | "archived" | "upcoming";
  startDate?: Date | null;
  endDate?: Date | null;
  sortOrder: number;
  seo?: {
    title?: string;
    description?: string;
    keywords?: string[];
  };
  createdAt: Date;
  updatedAt: Date;
}

const collectionSchema = new Schema<ICollection>(
  {
    name: {
      type: String,
      required: [true, "Collection name is required"],
      trim: true,
      maxlength: [120, "Collection name cannot exceed 120 characters"],
    },
    slug: {
      type: String,
      required: [true, "Collection slug is required"],
      unique: true,
      lowercase: true,
      trim: true,
      index: true,
    },
    description: {
      type: String,
      trim: true,
    },
    bannerImage: {
      type: String,
      required: [true, "Banner image is required for collections"],
    },
    thumbnailImage: {
      type: String,
    },
    products: [
      {
        type: Schema.Types.ObjectId,
        ref: "Product",
      },
    ],
    isFeatured: {
      type: Boolean,
      default: false,
      index: true,
    },
    status: {
      type: String,
      enum: ["active", "archived", "upcoming", "ACTIVE", "INACTIVE", "ARCHIVED", "UPCOMING"],
      default: "ACTIVE",
      index: true,
    },
    startDate: {
      type: Date,
      default: null,
    },
    endDate: {
      type: Date,
      default: null,
    },
    sortOrder: {
      type: Number,
      default: 0,
    },
    seo: {
      title: { type: String, trim: true },
      description: { type: String, trim: true },
      keywords: [{ type: String, trim: true }],
    },
  },
  {
    timestamps: true,
  }
);

collectionSchema.pre("validate", function (next) {
  if (this.name && (!this.slug || this.isModified("name"))) {
    this.slug = this.name
      .toLowerCase()
      .trim()
      .replace(/[^\w\s-]/g, "")
      .replace(/[\s_-]+/g, "-")
      .replace(/^-+|-+$/g, "");
  }
  next();
});

export const Collection: Model<ICollection> =
  mongoose.models.Collection || mongoose.model<ICollection>("Collection", collectionSchema);
export default Collection;
