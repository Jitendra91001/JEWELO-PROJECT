import { Response } from "express";
import { asyncHandler } from "../utils/asyncHandler";
import { ApiResponse } from "../utils/ApiResponse";
import { ApiError } from "../utils/ApiError";
import { Banner } from "../models";
import { AuthenticatedRequest } from "../types";
import { parsePaginationParams } from "../utils/pagination";
import { uploadToCloudinary, CLOUDINARY_FOLDERS } from "../services/cloudinary.service";
import { logAudit } from "../services/audit.service";

export const getBanners = asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
  const { page, limit, skip } = parsePaginationParams(req);
  const { placement, status, includeScheduled } = req.query as Record<string, string>;

  const filter: any = { isDeleted: false };
  if (placement) {
    filter.placement = placement.toUpperCase();
  }

  if (status) {
    filter.status = status.toUpperCase();
  } else if (!req.user || req.user.role === "CUSTOMER") {
    filter.status = "PUBLISHED";
  }

  // Active dates check unless admin asks for all scheduled
  if (includeScheduled !== "true") {
    const now = new Date();
    filter.$or = [
      { startDate: null, endDate: null },
      { startDate: { $lte: now }, endDate: null },
      { startDate: null, endDate: { $gte: now } },
      { startDate: { $lte: now }, endDate: { $gte: now } },
    ];
  }

  const [banners, total] = await Promise.all([
    Banner.find(filter)
      .sort({ priorityOrder: 1, sortOrder: 1, createdAt: -1 })
      .skip(skip)
      .limit(limit),
    Banner.countDocuments(filter),
  ]);

  return ApiResponse.paginated(res, "Banners retrieved successfully", banners, page, limit, total);
});

export const getBannerById = asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
  const { id } = req.params;

  const banner = await Banner.findOne({ _id: id, isDeleted: false });
  if (!banner) {
    throw ApiError.notFound("Banner not found");
  }

  return ApiResponse.success(res, "Banner details retrieved successfully", banner);
});

export const createBanner = asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
  const {
    title,
    subtitle,
    tagline,
    desktopImage,
    mobileImage,
    linkUrl,
    ctaUrl,
    buttonText,
    ctaText,
    placement = "HERO_CAROUSEL",
    priorityOrder,
    sortOrder,
    startDate,
    endDate,
    status = "PUBLISHED",
  } = req.body;

  let desktopUrl = desktopImage;
  let mobileUrl = mobileImage;

  const files = req.files as { [fieldname: string]: Express.Multer.File[] } | undefined;
  if (files) {
    if (files.desktopImage && files.desktopImage.length > 0) {
      const desktopUpload = await uploadToCloudinary(files.desktopImage[0].buffer, CLOUDINARY_FOLDERS.BANNERS);
      desktopUrl = desktopUpload.secure_url;
    }
    if (files.mobileImage && files.mobileImage.length > 0) {
      const mobileUpload = await uploadToCloudinary(files.mobileImage[0].buffer, CLOUDINARY_FOLDERS.BANNERS);
      mobileUrl = mobileUpload.secure_url;
    }
  }

  if (!desktopUrl) {
    throw ApiError.badRequest("Desktop banner image is mandatory");
  }

  const banner = await Banner.create({
    title: title.trim(),
    subtitle,
    tagline,
    desktopImage: desktopUrl,
    mobileImage: mobileUrl,
    linkUrl: ctaUrl || linkUrl,
    ctaUrl: ctaUrl || linkUrl,
    buttonText: ctaText || buttonText || "Explore Collection",
    ctaText: ctaText || buttonText || "Explore Collection",
    placement: placement.toUpperCase(),
    priorityOrder: Number(priorityOrder || sortOrder) || 0,
    sortOrder: Number(sortOrder || priorityOrder) || 0,
    startDate: startDate ? new Date(startDate) : null,
    endDate: endDate ? new Date(endDate) : null,
    status: status.toUpperCase(),
    isActive: status.toUpperCase() === "PUBLISHED",
    createdBy: req.user?.id,
  });

  await logAudit(req, {
    action: "BANNER_CREATE",
    module: "BANNER",
    entityId: banner._id.toString(),
    entityType: "Banner",
    changes: { after: { title: banner.title, placement: banner.placement } },
  });

  return ApiResponse.created(res, "Banner created successfully", banner);
});

export const updateBanner = asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
  const { id } = req.params;

  const banner = await Banner.findOne({ _id: id, isDeleted: false });
  if (!banner) {
    throw ApiError.notFound("Banner not found");
  }

  const {
    title,
    subtitle,
    tagline,
    linkUrl,
    ctaUrl,
    buttonText,
    ctaText,
    placement,
    priorityOrder,
    sortOrder,
    startDate,
    endDate,
    status,
  } = req.body;

  if (title) banner.title = title.trim();
  if (subtitle !== undefined) banner.subtitle = subtitle;
  if (tagline !== undefined) banner.tagline = tagline;
  if (ctaUrl || linkUrl) {
    banner.linkUrl = ctaUrl || linkUrl;
    banner.ctaUrl = ctaUrl || linkUrl;
  }
  if (ctaText || buttonText) {
    banner.buttonText = ctaText || buttonText;
    banner.ctaText = ctaText || buttonText;
  }
  if (placement) banner.placement = placement.toUpperCase();
  if (priorityOrder !== undefined) banner.priorityOrder = Number(priorityOrder);
  if (sortOrder !== undefined) banner.sortOrder = Number(sortOrder);
  if (startDate !== undefined) banner.startDate = startDate ? new Date(startDate) : null;
  if (endDate !== undefined) banner.endDate = endDate ? new Date(endDate) : null;
  if (status !== undefined) {
    banner.status = status.toUpperCase();
    banner.isActive = status.toUpperCase() === "PUBLISHED";
  }

  // Handle uploaded files replacement
  const files = req.files as { [fieldname: string]: Express.Multer.File[] } | undefined;
  if (files) {
    if (files.desktopImage && files.desktopImage.length > 0) {
      const desktopUpload = await uploadToCloudinary(files.desktopImage[0].buffer, CLOUDINARY_FOLDERS.BANNERS);
      banner.desktopImage = desktopUpload.secure_url;
    }
    if (files.mobileImage && files.mobileImage.length > 0) {
      const mobileUpload = await uploadToCloudinary(files.mobileImage[0].buffer, CLOUDINARY_FOLDERS.BANNERS);
      banner.mobileImage = mobileUpload.secure_url;
    }
  }

  await banner.save();

  await logAudit(req, {
    action: "BANNER_UPDATE",
    module: "BANNER",
    entityId: id,
    entityType: "Banner",
  });

  return ApiResponse.success(res, "Banner updated successfully", banner);
});

export const deleteBanner = asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
  const { id } = req.params;

  const banner = await Banner.findOne({ _id: id, isDeleted: false });
  if (!banner) {
    throw ApiError.notFound("Banner not found");
  }

  banner.isDeleted = true;
  banner.deletedAt = new Date();
  banner.isActive = false;
  banner.status = "EXPIRED";
  await banner.save();

  await logAudit(req, {
    action: "BANNER_DELETE",
    module: "BANNER",
    entityId: id,
    entityType: "Banner",
  });

  return ApiResponse.success(res, "Banner deleted successfully");
});
