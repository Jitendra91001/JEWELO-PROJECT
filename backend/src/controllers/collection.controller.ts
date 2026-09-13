import { Response } from "express";
import { Types } from "mongoose";
import { asyncHandler } from "../utils/asyncHandler";
import { ApiResponse } from "../utils/ApiResponse";
import { ApiError } from "../utils/ApiError";
import { Collection, Product } from "../models";
import { AuthenticatedRequest } from "../types";
import { parsePaginationParams } from "../utils/pagination";
import { uploadToCloudinary, CLOUDINARY_FOLDERS } from "../services/cloudinary.service";
import { logAudit } from "../services/audit.service";

export const getCollections = asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
  const { page, limit, skip } = parsePaginationParams(req);
  const { search, status, isFeatured, includeScheduled } = req.query as Record<string, string>;

  const filter: any = {};

  if (status) {
    filter.status = new RegExp(`^${status}$`, "i");
  } else {
    filter.status = { $in: ["active", "ACTIVE", "upcoming", "UPCOMING"] };
  }

  // Active scheduling check (unless includeScheduled is requested by admin)
  if (includeScheduled !== "true") {
    const now = new Date();
    filter.$or = [
      { startDate: null, endDate: null },
      { startDate: { $lte: now }, endDate: null },
      { startDate: null, endDate: { $gte: now } },
      { startDate: { $lte: now }, endDate: { $gte: now } },
    ];
  }

  if (isFeatured !== undefined) {
    filter.isFeatured = isFeatured === "true";
  }

  if (search) {
    filter.$or = [
      { name: { $regex: search, $options: "i" } },
      { slug: { $regex: search, $options: "i" } },
      { description: { $regex: search, $options: "i" } },
    ];
  }

  const [collections, total] = await Promise.all([
    Collection.find(filter)
      .sort({ sortOrder: 1, isFeatured: -1, createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .populate("products", "name slug price thumbnail stock"),
    Collection.countDocuments(filter),
  ]);

  return ApiResponse.paginated(res, "Collections retrieved successfully", collections, page, limit, total);
});

export const getCollectionById = asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
  const { id } = req.params;

  let query: any = {};
  if (Types.ObjectId.isValid(id)) {
    query._id = id;
  } else {
    query.slug = id.toLowerCase().trim();
  }

  const collection = await Collection.findOne(query).populate({
    path: "products",
    match: { isDeleted: false, status: "PUBLISHED" },
    populate: { path: "category", select: "name slug" },
  });

  if (!collection) {
    throw ApiError.notFound("Collection not found");
  }

  return ApiResponse.success(res, "Collection retrieved successfully", collection);
});

export const createCollection = asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
  const { name, slug, description, products, startDate, endDate, status, isFeatured, sortOrder, seo } = req.body;

  let finalSlug = slug;
  if (!finalSlug && name) {
    finalSlug = name
      .toLowerCase()
      .trim()
      .replace(/[^\w\s-]/g, "")
      .replace(/[\s_-]+/g, "-");
  }

  const existing = await Collection.findOne({ slug: finalSlug });
  if (existing) {
    throw ApiError.conflict(`Collection slug "${finalSlug}" is already in use`);
  }

  // Handle uploaded files (banner, thumbnail)
  let bannerUrl = req.body.banner || req.body.bannerImage;
  let thumbnailUrl = req.body.thumbnail || req.body.thumbnailImage;

  const files = req.files as { [fieldname: string]: Express.Multer.File[] } | undefined;
  if (files) {
    if (files.banner && files.banner.length > 0) {
      const bannerUpload = await uploadToCloudinary(files.banner[0].buffer, CLOUDINARY_FOLDERS.COLLECTIONS);
      bannerUrl = bannerUpload.secure_url;
    }
    if (files.thumbnail && files.thumbnail.length > 0) {
      const thumbUpload = await uploadToCloudinary(files.thumbnail[0].buffer, CLOUDINARY_FOLDERS.COLLECTIONS);
      thumbnailUrl = thumbUpload.secure_url;
    }
  }

  if (!bannerUrl) {
    bannerUrl = thumbnailUrl || "https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?auto=format&fit=crop&w=1200&q=80";
  }

  const parsedProducts = Array.isArray(products)
    ? products
    : typeof products === "string"
    ? JSON.parse(products)
    : [];

  const collection = await Collection.create({
    name: name.trim(),
    slug: finalSlug,
    description,
    bannerImage: bannerUrl,
    thumbnailImage: thumbnailUrl,
    products: parsedProducts,
    startDate: startDate ? new Date(startDate) : null,
    endDate: endDate ? new Date(endDate) : null,
    status: status ? status.toUpperCase() : "ACTIVE",
    isFeatured: isFeatured === "true" || isFeatured === true,
    sortOrder: Number(sortOrder) || 0,
    seo: typeof seo === "string" ? JSON.parse(seo) : seo,
  });

  await logAudit(req, {
    action: "COLLECTION_CREATE",
    module: "COLLECTION",
    entityId: collection._id.toString(),
    entityType: "Collection",
    changes: { after: { name: collection.name, slug: collection.slug } },
  });

  return ApiResponse.created(res, "Collection created successfully", collection);
});

export const updateCollection = asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
  const { id } = req.params;

  const collection = await Collection.findById(id);
  if (!collection) {
    throw ApiError.notFound("Collection not found");
  }

  const { name, slug, description, products, startDate, endDate, status, isFeatured, sortOrder, seo } = req.body;

  if (slug && slug.toLowerCase().trim() !== collection.slug) {
    const existing = await Collection.findOne({ slug: slug.toLowerCase().trim(), _id: { $ne: id } });
    if (existing) {
      throw ApiError.conflict(`Collection slug "${slug}" already in use`);
    }
    collection.slug = slug.toLowerCase().trim();
  }

  if (name) collection.name = name.trim();
  if (description !== undefined) collection.description = description;
  if (sortOrder !== undefined) collection.sortOrder = Number(sortOrder);
  if (status !== undefined) collection.status = status.toUpperCase();
  if (isFeatured !== undefined) collection.isFeatured = isFeatured === "true" || isFeatured === true;
  if (startDate !== undefined) collection.startDate = startDate ? new Date(startDate) : null;
  if (endDate !== undefined) collection.endDate = endDate ? new Date(endDate) : null;
  if (seo !== undefined) collection.seo = typeof seo === "string" ? JSON.parse(seo) : seo;

  if (products !== undefined) {
    collection.products = Array.isArray(products)
      ? products
      : typeof products === "string"
      ? JSON.parse(products)
      : [];
  }

  // Handle media replacement
  const files = req.files as { [fieldname: string]: Express.Multer.File[] } | undefined;
  if (files) {
    if (files.banner && files.banner.length > 0) {
      const bannerUpload = await uploadToCloudinary(files.banner[0].buffer, CLOUDINARY_FOLDERS.COLLECTIONS);
      collection.bannerImage = bannerUpload.secure_url;
    }
    if (files.thumbnail && files.thumbnail.length > 0) {
      const thumbUpload = await uploadToCloudinary(files.thumbnail[0].buffer, CLOUDINARY_FOLDERS.COLLECTIONS);
      collection.thumbnailImage = thumbUpload.secure_url;
    }
  }

  await collection.save();

  await logAudit(req, {
    action: "COLLECTION_UPDATE",
    module: "COLLECTION",
    entityId: id,
    entityType: "Collection",
  });

  return ApiResponse.success(res, "Collection updated successfully", collection);
});

export const deleteCollection = asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
  const { id } = req.params;

  const collection = await Collection.findById(id);
  if (!collection) {
    throw ApiError.notFound("Collection not found");
  }

  collection.status = "ARCHIVED";
  await collection.save();

  await logAudit(req, {
    action: "COLLECTION_DELETE",
    module: "COLLECTION",
    entityId: id,
    entityType: "Collection",
  });

  return ApiResponse.success(res, "Collection archived successfully");
});
