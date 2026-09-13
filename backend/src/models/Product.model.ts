import mongoose, { Document, Schema, Model, Types } from "mongoose";
import {
  METAL_TYPES,
  METAL_PURITIES,
  GEMSTONE_TYPES,
  DIAMOND_CUTS,
  DIAMOND_CLARITIES,
  DIAMOND_COLORS,
  CERTIFICATION_AGENCIES,
} from "../constants";

export interface IDiamondDetail {
  carat: number;
  clarity: string;
  color: string;
  cut: string;
  count: number;
  shape?: string;
  settingType?: string;
}

export interface IGemstoneDetail {
  type: string;
  name?: string;
  weightCarat?: number;
  count?: number;
  color?: string;
  origin?: string;
}

export interface ICertification {
  agency: string;
  certificateNumber?: string;
  certificateUrl?: string;
  isHallmarked: boolean;
}

export interface IProduct extends Document {
  sku: string;
  name: string;
  slug: string;
  description: string;
  shortDescription?: string;
  category: Types.ObjectId;
  subcategory?: Types.ObjectId | null;
  collectionId?: Types.ObjectId | null;
  variants?: Types.ObjectId[];

  // Precious Metal Specifications
  metalType: string;
  metalPurity: string;
  metalWeight: number; // in grams

  // Diamond & Gemstone Metrics
  diamondDetails?: IDiamondDetail[];
  totalDiamondWeightCarat?: number;
  gemstones?: IGemstoneDetail[];

  // Hallmarking & Laboratory Certifications
  certification?: ICertification;

  // Commercials & Pricing
  price: number;
  comparePrice?: number;
  costPrice?: number;
  discountPercentage?: number;
  taxPercentage: number; // GST in India typically 3% for precious jewellery

  // Vault Stock & Logistics
  stock: number;
  safetyThreshold: number;
  inStock: boolean;

  // Media
  images: string[];
  thumbnail: string;
  videos?: string[];

  // Options & Attributes
  sizes: string[];
  gender?: "Women" | "Men" | "Unisex" | "Kids";
  occasion?: string[];

  // Flags & Status
  status: "draft" | "active" | "inactive" | "archived";
  isFeatured: boolean;
  isBestseller: boolean;
  isNewArrival: boolean;

  // Ratings & Social Proof
  rating: number;
  reviewsCount: number;

  // Search Engine Optimization
  seo?: {
    title?: string;
    description?: string;
    keywords?: string[];
  };

  // Audit
  createdBy?: Types.ObjectId;
  updatedBy?: Types.ObjectId;
  isDeleted: boolean;
  deletedAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}

const productSchema = new Schema<IProduct>(
  {
    sku: {
      type: String,
      required: [true, "Product SKU is mandatory"],
      unique: true,
      uppercase: true,
      trim: true,
      index: true,
    },
    name: {
      type: String,
      required: [true, "Masterpiece product name is required"],
      trim: true,
      maxlength: [200, "Product name cannot exceed 200 characters"],
      index: true,
    },
    slug: {
      type: String,
      required: [true, "Product slug is required"],
      unique: true,
      lowercase: true,
      trim: true,
      index: true,
    },
    description: {
      type: String,
      required: [true, "Product description is required"],
      trim: true,
    },
    shortDescription: {
      type: String,
      trim: true,
    },
    category: {
      type: Schema.Types.ObjectId,
      ref: "Category",
      required: [true, "Category reference is required"],
      index: true,
    },
    subcategory: {
      type: Schema.Types.ObjectId,
      ref: "Category",
      default: null,
      index: true,
    },
    collectionId: {
      type: Schema.Types.ObjectId,
      ref: "Collection",
      default: null,
      index: true,
    },
    variants: [
      {
        type: Schema.Types.ObjectId,
        ref: "ProductVariant",
      },
    ],

    // Precious Metals
    metalType: {
      type: String,
      enum: Object.values(METAL_TYPES),
      required: [true, "Metal type is required"],
      index: true,
    },
    metalPurity: {
      type: String,
      enum: Object.values(METAL_PURITIES),
      required: [true, "Metal purity is required"],
      index: true,
    },
    metalWeight: {
      type: Number,
      required: [true, "Metal weight in grams is required"],
      min: [0.01, "Metal weight must be positive"],
    },

    // Diamonds
    diamondDetails: [
      {
        carat: { type: Number, default: 0 },
        clarity: { type: String, enum: Object.values(DIAMOND_CLARITIES) },
        color: { type: String, enum: Object.values(DIAMOND_COLORS) },
        cut: { type: String, enum: Object.values(DIAMOND_CUTS) },
        count: { type: Number, default: 1 },
        shape: { type: String, default: "Round Brilliant" },
        settingType: { type: String, default: "Prong" },
      },
    ],
    totalDiamondWeightCarat: {
      type: Number,
      default: 0,
    },

    // Gemstones
    gemstones: [
      {
        type: { type: String, enum: Object.values(GEMSTONE_TYPES) },
        name: { type: String },
        weightCarat: { type: Number, default: 0 },
        count: { type: Number, default: 1 },
        color: { type: String },
        origin: { type: String },
      },
    ],

    // Certifications
    certification: {
      agency: {
        type: String,
        enum: Object.values(CERTIFICATION_AGENCIES),
        default: CERTIFICATION_AGENCIES.BIS_HALLMARK,
      },
      certificateNumber: { type: String, trim: true },
      certificateUrl: { type: String, trim: true },
      isHallmarked: { type: Boolean, default: true },
    },

    // Commercials
    price: {
      type: Number,
      required: [true, "Price is required"],
      min: [0, "Price cannot be negative"],
      index: true,
    },
    comparePrice: {
      type: Number,
      min: [0, "Compare price cannot be negative"],
    },
    costPrice: {
      type: Number,
    },
    discountPercentage: {
      type: Number,
      default: 0,
      min: 0,
      max: 100,
    },
    taxPercentage: {
      type: Number,
      default: 3, // 3% standard GST for precious gold/diamonds
    },

    // Stock
    stock: {
      type: Number,
      required: true,
      default: 1,
      min: [0, "Stock cannot be negative"],
      index: true,
    },
    safetyThreshold: {
      type: Number,
      default: 2,
    },
    inStock: {
      type: Boolean,
      default: true,
      index: true,
    },

    // Media
    images: {
      type: [String],
      validate: [(val: string[]) => val.length > 0, "At least one product showcase image is required"],
    },
    thumbnail: {
      type: String,
    },
    videos: [{ type: String }],

    // Dimensions & Sizes
    sizes: [{ type: String, trim: true }],
    gender: {
      type: String,
      enum: ["Women", "Men", "Unisex", "Kids"],
      default: "Women",
      index: true,
    },
    occasion: [{ type: String, trim: true }],

    // Status & Badges
    status: {
      type: String,
      enum: ["draft", "active", "inactive", "archived"],
      default: "active",
      index: true,
    },
    isFeatured: {
      type: Boolean,
      default: false,
      index: true,
    },
    isBestseller: {
      type: Boolean,
      default: false,
      index: true,
    },
    isNewArrival: {
      type: Boolean,
      default: true,
      index: true,
    },

    // Ratings
    rating: {
      type: Number,
      default: 5.0,
      min: 1,
      max: 5,
    },
    reviewsCount: {
      type: Number,
      default: 0,
    },

    // SEO
    seo: {
      title: { type: String, trim: true },
      description: { type: String, trim: true },
      keywords: [{ type: String, trim: true }],
    },

    // Audit
    createdBy: { type: Schema.Types.ObjectId, ref: "User" },
    updatedBy: { type: Schema.Types.ObjectId, ref: "User" },
    isDeleted: { type: Boolean, default: false, index: true },
    deletedAt: { type: Date, default: null },
  },
  {
    timestamps: true,
  }
);

// Compound Indexes for fast filter queries
productSchema.index({ category: 1, status: 1, price: 1 });
productSchema.index({ metalType: 1, metalPurity: 1, inStock: 1 });
productSchema.index({ isFeatured: 1, isNewArrival: 1, status: 1 });
productSchema.index({ name: "text", description: "text", sku: "text" });

// Pre-validate hook for slug, thumbnail, and stock status
productSchema.pre("validate", function (next) {
  if (this.name && (!this.slug || this.isModified("name"))) {
    this.slug = this.name
      .toLowerCase()
      .trim()
      .replace(/[^\w\s-]/g, "")
      .replace(/[\s_-]+/g, "-")
      .replace(/^-+|-+$/g, "");
  }

  if (this.images && this.images.length > 0 && !this.thumbnail) {
    this.thumbnail = this.images[0];
  }

  this.inStock = (this.stock ?? 0) > 0;

  if (this.comparePrice && this.comparePrice > this.price) {
    this.discountPercentage = Math.round(
      ((this.comparePrice - this.price) / this.comparePrice) * 100
    );
  }

  next();
});

export const Product: Model<IProduct> =
  mongoose.models.Product || mongoose.model<IProduct>("Product", productSchema);
export default Product;
