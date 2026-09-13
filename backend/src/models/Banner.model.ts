import mongoose, { Document, Schema, Model, Types } from "mongoose";

export const BANNER_PLACEMENTS = {
  HERO_CAROUSEL: "HERO_CAROUSEL",
  FEATURED_BANNER: "FEATURED_BANNER",
  CATEGORY_STRIP: "CATEGORY_STRIP",
  POPUP: "POPUP",
} as const;

export type BannerPlacement = (typeof BANNER_PLACEMENTS)[keyof typeof BANNER_PLACEMENTS];

export interface IBanner extends Document {
  title: string;
  subtitle?: string;
  tagline?: string;
  desktopImage: string;
  mobileImage?: string;
  linkUrl?: string;
  ctaUrl?: string;
  buttonText?: string;
  ctaText?: string;
  placement: BannerPlacement;
  priorityOrder: number;
  sortOrder?: number;
  startDate?: Date | null;
  endDate?: Date | null;
  status: "DRAFT" | "SCHEDULED" | "PUBLISHED" | "EXPIRED";
  isActive: boolean;
  isDeleted: boolean;
  deletedAt?: Date | null;
  createdBy?: Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

const bannerSchema = new Schema<IBanner>(
  {
    title: {
      type: String,
      required: [true, "Banner title is required"],
      trim: true,
      maxlength: [120, "Banner title cannot exceed 120 characters"],
    },
    subtitle: {
      type: String,
      trim: true,
      maxlength: [200, "Banner subtitle cannot exceed 200 characters"],
    },
    tagline: {
      type: String,
      trim: true,
      maxlength: [80, "Tagline cannot exceed 80 characters"],
    },
    desktopImage: {
      type: String,
      required: [true, "Desktop banner image URL is required"],
      trim: true,
    },
    mobileImage: {
      type: String,
      trim: true,
    },
    linkUrl: {
      type: String,
      trim: true,
    },
    ctaUrl: {
      type: String,
      trim: true,
    },
    buttonText: {
      type: String,
      trim: true,
      default: "Explore Collection",
    },
    ctaText: {
      type: String,
      trim: true,
    },
    placement: {
      type: String,
      enum: Object.values(BANNER_PLACEMENTS),
      default: BANNER_PLACEMENTS.HERO_CAROUSEL,
      index: true,
    },
    priorityOrder: {
      type: Number,
      default: 0,
    },
    sortOrder: {
      type: Number,
      default: 0,
    },
    startDate: {
      type: Date,
      default: null,
    },
    endDate: {
      type: Date,
      default: null,
    },
    status: {
      type: String,
      enum: ["DRAFT", "SCHEDULED", "PUBLISHED", "EXPIRED"],
      default: "PUBLISHED",
      index: true,
    },
    isActive: {
      type: Boolean,
      default: true,
      index: true,
    },
    isDeleted: {
      type: Boolean,
      default: false,
      index: true,
    },
    deletedAt: {
      type: Date,
      default: null,
    },
    createdBy: {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
  },
  {
    timestamps: true,
  }
);

bannerSchema.index({ placement: 1, priorityOrder: 1, isActive: 1 });

export const Banner: Model<IBanner> =
  mongoose.models.Banner || mongoose.model<IBanner>("Banner", bannerSchema);
export default Banner;
