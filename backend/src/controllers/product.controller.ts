import { Response } from "express";
import { Types } from "mongoose";
import { asyncHandler } from "../utils/asyncHandler";
import { ApiResponse } from "../utils/ApiResponse";
import { ApiError } from "../utils/ApiError";
import { Product, Category, Collection } from "../models";
import { AuthenticatedRequest } from "../types";
import { parsePaginationParams } from "../utils/pagination";
import { uploadToCloudinary, CLOUDINARY_FOLDERS } from "../services/cloudinary.service";
import { logAudit } from "../services/audit.service";

export const getProducts = asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
  const { page, limit, skip } = parsePaginationParams(req);
  const {
    category,
    subcategory,
    collection: collectionParam,
    collectionId,
    metal,
    metalType,
    purity,
    metalPurity,
    gemstone,
    priceMin,
    priceMax,
    minPrice,
    maxPrice,
    gender,
    stock,
    inStock,
    rating,
    discount,
    featured,
    isFeatured,
    bestseller,
    isBestseller,
    newArrival,
    isNewArrival,
    sort,
    search,
    status,
  } = req.query as Record<string, any>;

  const filter: any = { isDeleted: false };

  // Status filter (Default published for public, or specified)
  if (status) {
    filter.status = new RegExp(`^${status}$`, "i");
  } else if (!req.user || req.user.role === "CUSTOMER") {
    filter.status = { $in: ["published", "PUBLISHED", "active", "ACTIVE"] };
  }

  // Category filter (support ObjectId or slug)
  if (category) {
    if (Types.ObjectId.isValid(category)) {
      filter.category = category;
    } else {
      const foundCat = await Category.findOne({ slug: category, isDeleted: false });
      if (foundCat) filter.category = foundCat._id;
    }
  }

  // Subcategory filter
  if (subcategory) {
    if (Types.ObjectId.isValid(subcategory)) {
      filter.subcategory = subcategory;
    } else {
      const foundSub = await Category.findOne({ slug: subcategory, isDeleted: false });
      if (foundSub) filter.subcategory = foundSub._id;
    }
  }

  // Collection filter
  const targetCollection = collectionId || collectionParam;
  if (targetCollection) {
    if (Types.ObjectId.isValid(targetCollection)) {
      filter.collectionId = targetCollection;
    } else {
      const foundCol = await Collection.findOne({ slug: targetCollection });
      if (foundCol) filter.collectionId = foundCol._id;
    }
  }

  // Metal & Purity filters
  const metalValue = metal || metalType;
  if (metalValue) {
    filter.metalType = new RegExp(String(metalValue), "i");
  }

  const purityValue = purity || metalPurity;
  if (purityValue) {
    filter.metalPurity = purityValue;
  }

  // Gemstone filter
  if (gemstone) {
    filter.$or = [
      { "gemstones.type": new RegExp(gemstone, "i") },
      { "gemstones.name": new RegExp(gemstone, "i") },
    ];
  }

  // Price range filters
  const effectiveMin = minPrice !== undefined ? minPrice : priceMin;
  const effectiveMax = maxPrice !== undefined ? maxPrice : priceMax;

  if (effectiveMin !== undefined || effectiveMax !== undefined) {
    filter.price = {};
    if (effectiveMin !== undefined) filter.price.$gte = Number(effectiveMin);
    if (effectiveMax !== undefined) filter.price.$lte = Number(effectiveMax);
  }

  // Gender filter
  if (gender) {
    filter.gender = new RegExp(gender, "i");
  }

  // Stock filters
  if (inStock !== undefined) {
    filter.inStock = inStock === "true" || inStock === true;
  }
  if (stock === "low") {
    filter.$expr = { $lte: ["$stock", "$safetyThreshold"] };
    filter.stock = { $gt: 0 };
  } else if (stock === "out") {
    filter.stock = 0;
  }

  // Rating filter
  if (rating) {
    filter.rating = { $gte: Number(rating) };
  }

  // Discount filter
  if (discount) {
    filter.discountPercentage = { $gte: Number(discount) };
  }

  // Flags filters
  const hasFeatured = isFeatured !== undefined ? isFeatured : featured;
  if (hasFeatured !== undefined) {
    filter.isFeatured = hasFeatured === "true" || hasFeatured === true;
  }

  const hasBestseller = isBestseller !== undefined ? isBestseller : bestseller;
  if (hasBestseller !== undefined) {
    filter.isBestseller = hasBestseller === "true" || hasBestseller === true;
  }

  const hasNewArrival = isNewArrival !== undefined ? isNewArrival : newArrival;
  if (hasNewArrival !== undefined) {
    filter.isNewArrival = hasNewArrival === "true" || hasNewArrival === true;
  }

  // Search keyword across name, sku, description, tags
  if (search) {
    const searchRegex = new RegExp(String(search), "i");
    filter.$or = [
      { name: searchRegex },
      { sku: searchRegex },
      { description: searchRegex },
      { shortDescription: searchRegex },
      { "seo.keywords": searchRegex },
    ];
  }

  // Sorting
  let sortOption: any = { createdAt: -1 };
  if (sort === "price_asc" || sort === "price_low") sortOption = { price: 1 };
  else if (sort === "price_desc" || sort === "price_high") sortOption = { price: -1 };
  else if (sort === "rating") sortOption = { rating: -1 };
  else if (sort === "bestseller") sortOption = { isBestseller: -1, rating: -1 };
  else if (sort === "newest" || sort === "new-arrivals") sortOption = { createdAt: -1 };
  else if (sort === "popular") sortOption = { reviewsCount: -1, rating: -1 };

  const [products, total] = await Promise.all([
    Product.find(filter)
      .sort(sortOption)
      .skip(skip)
      .limit(limit)
      .populate("category", "name slug")
      .populate("subcategory", "name slug")
      .populate("collectionId", "name slug bannerImage")
      .populate("variants"),
    Product.countDocuments(filter),
  ]);

  return ApiResponse.paginated(res, "Products retrieved successfully", products, page, limit, total);
});

export const getProductById = asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
  const { id } = req.params;

  let query: any = { isDeleted: false };
  if (Types.ObjectId.isValid(id)) {
    query._id = id;
  } else {
    query.$or = [{ slug: id.toLowerCase().trim() }, { sku: id.toUpperCase().trim() }];
  }

  const product = await Product.findOne(query)
    .populate("category", "name slug")
    .populate("subcategory", "name slug")
    .populate("collectionId", "name slug bannerImage")
    .populate("variants");

  if (!product) {
    throw ApiError.notFound(`Product not found with identifier: ${id}`);
  }

  return ApiResponse.success(res, "Product retrieved successfully", product);
});

export const createProduct = asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
  const data = req.body;

  // SKU Check
  const existingSku = await Product.findOne({ sku: data.sku.toUpperCase().trim(), isDeleted: false });
  if (existingSku) {
    throw ApiError.conflict(`Product with SKU "${data.sku}" already exists`);
  }

  // Upload image buffers to Cloudinary if Multer captured files
  const uploadedImages: string[] = [];
  if (req.files && Array.isArray(req.files)) {
    for (const file of req.files as Express.Multer.File[]) {
      const upload = await uploadToCloudinary(file.buffer, CLOUDINARY_FOLDERS.PRODUCTS);
      uploadedImages.push(upload.secure_url);
    }
  }

  if (uploadedImages.length > 0) {
    data.images = [...(data.images ? (Array.isArray(data.images) ? data.images : [data.images]) : []), ...uploadedImages];
    if (!data.thumbnail) {
      data.thumbnail = data.images[0];
    }
  }

  // Parse JSON fields if passed as string via multipart/form-data
  if (typeof data.diamondDetails === "string") data.diamondDetails = JSON.parse(data.diamondDetails);
  if (typeof data.gemstones === "string") data.gemstones = JSON.parse(data.gemstones);
  if (typeof data.certification === "string") data.certification = JSON.parse(data.certification);
  if (typeof data.seo === "string") data.seo = JSON.parse(data.seo);
  if (typeof data.sizes === "string") data.sizes = JSON.parse(data.sizes);
  if (typeof data.occasion === "string") data.occasion = JSON.parse(data.occasion);

  data.sku = data.sku.toUpperCase().trim();
  data.createdBy = req.user?.id;

  const product = await Product.create(data);

  await logAudit(req, {
    action: "PRODUCT_CREATE",
    module: "PRODUCT",
    entityId: product._id.toString(),
    entityType: "Product",
    changes: { after: { name: product.name, sku: product.sku, price: product.price } },
  });

  const populated = await Product.findById(product._id)
    .populate("category", "name slug")
    .populate("collectionId", "name slug");

  return ApiResponse.created(res, "Product created successfully", populated);
});

export const updateProduct = asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
  const { id } = req.params;

  const product = await Product.findOne({ _id: id, isDeleted: false });
  if (!product) {
    throw ApiError.notFound("Product not found");
  }

  const data = req.body;

  if (data.sku && data.sku.toUpperCase().trim() !== product.sku) {
    const existing = await Product.findOne({
      sku: data.sku.toUpperCase().trim(),
      _id: { $ne: id },
      isDeleted: false,
    });
    if (existing) {
      throw ApiError.conflict(`Product with SKU "${data.sku}" already exists`);
    }
    data.sku = data.sku.toUpperCase().trim();
  }

  // Handle uploaded images through Cloudinary
  if (req.files && Array.isArray(req.files) && req.files.length > 0) {
    const newImages: string[] = [];
    for (const file of req.files as Express.Multer.File[]) {
      const upload = await uploadToCloudinary(file.buffer, CLOUDINARY_FOLDERS.PRODUCTS);
      newImages.push(upload.secure_url);
    }
    data.images = [...(product.images || []), ...newImages];
  }

  // Parse JSON fields if passed as string via multipart/form-data
  if (typeof data.diamondDetails === "string") data.diamondDetails = JSON.parse(data.diamondDetails);
  if (typeof data.gemstones === "string") data.gemstones = JSON.parse(data.gemstones);
  if (typeof data.certification === "string") data.certification = JSON.parse(data.certification);
  if (typeof data.seo === "string") data.seo = JSON.parse(data.seo);
  if (typeof data.sizes === "string") data.sizes = JSON.parse(data.sizes);
  if (typeof data.occasion === "string") data.occasion = JSON.parse(data.occasion);

  data.updatedBy = req.user?.id;
  const updatedProduct = await Product.findByIdAndUpdate(id, { $set: data }, { new: true })
    .populate("category", "name slug")
    .populate("collectionId", "name slug");

  await logAudit(req, {
    action: "PRODUCT_UPDATE",
    module: "PRODUCT",
    entityId: id,
    entityType: "Product",
  });

  return ApiResponse.success(res, "Product updated successfully", updatedProduct);
});

export const deleteProduct = asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
  const { id } = req.params;

  const product = await Product.findOne({ _id: id, isDeleted: false });
  if (!product) {
    throw ApiError.notFound("Product not found");
  }

  product.isDeleted = true;
  product.deletedAt = new Date();
  await product.save();

  await logAudit(req, {
    action: "PRODUCT_DELETE",
    module: "PRODUCT",
    entityId: id,
    entityType: "Product",
  });

  return ApiResponse.success(res, "Product deleted successfully");
});

// Granular Feature PATCH Endpoints
export const updateProductStatus = asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
  const { id } = req.params;
  const { status, isActive } = req.body;

  const product = await Product.findOne({ _id: id, isDeleted: false });
  if (!product) {
    throw ApiError.notFound("Product not found");
  }

  if (status) {
    product.status = status;
  } else if (isActive !== undefined) {
    product.status = isActive ? "active" : "inactive";
  } else {
    product.status = product.status === "active" ? "inactive" : "active";
  }

  await product.save();
  return ApiResponse.success(res, "Product status updated successfully", product);
});

export const toggleProductFeatured = asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
  const { id } = req.params;
  const { isFeatured } = req.body;

  const product = await Product.findOne({ _id: id, isDeleted: false });
  if (!product) {
    throw ApiError.notFound("Product not found");
  }

  product.isFeatured = isFeatured !== undefined ? Boolean(isFeatured) : !product.isFeatured;
  await product.save();

  return ApiResponse.success(res, "Product featured status updated successfully", product);
});

export const toggleProductBestseller = asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
  const { id } = req.params;
  const { isBestseller } = req.body;

  const product = await Product.findOne({ _id: id, isDeleted: false });
  if (!product) {
    throw ApiError.notFound("Product not found");
  }

  product.isBestseller = isBestseller !== undefined ? Boolean(isBestseller) : !product.isBestseller;
  await product.save();

  return ApiResponse.success(res, "Product bestseller status updated successfully", product);
});

export const toggleProductNewArrival = asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
  const { id } = req.params;
  const { isNewArrival } = req.body;

  const product = await Product.findOne({ _id: id, isDeleted: false });
  if (!product) {
    throw ApiError.notFound("Product not found");
  }

  product.isNewArrival = isNewArrival !== undefined ? Boolean(isNewArrival) : !product.isNewArrival;
  await product.save();

  return ApiResponse.success(res, "Product new arrival status updated successfully", product);
});

// Discovery shortcuts
export const getFeaturedProducts = asyncHandler(async (_req: AuthenticatedRequest, res: Response) => {
  const products = await Product.find({ isFeatured: true, isDeleted: false, status: { $in: ["published", "PUBLISHED", "active", "ACTIVE"] } })
    .limit(8)
    .populate("category", "name slug");
  return ApiResponse.success(res, "Featured products retrieved successfully", products);
});

export const getNewArrivals = asyncHandler(async (_req: AuthenticatedRequest, res: Response) => {
  const products = await Product.find({ isDeleted: false, status: { $in: ["published", "PUBLISHED", "active", "ACTIVE"] } })
    .sort({ createdAt: -1 })
    .limit(8)
    .populate("category", "name slug");
  return ApiResponse.success(res, "New arrivals retrieved successfully", products);
});

export const getBestSellers = asyncHandler(async (_req: AuthenticatedRequest, res: Response) => {
  const products = await Product.find({
    $or: [{ isBestseller: true }, { rating: { $gte: 4.5 } }],
    isDeleted: false,
    status: { $in: ["published", "PUBLISHED", "active", "ACTIVE"] },
  })
    .sort({ rating: -1, reviewsCount: -1 })
    .limit(8)
    .populate("category", "name slug");
  return ApiResponse.success(res, "Best sellers retrieved successfully", products);
});

export const searchProducts = asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
  const { q = "" } = req.query as { q?: string };
  if (!q.trim()) return ApiResponse.success(res, "Search results", []);

  const regex = new RegExp(q, "i");
  const products = await Product.find({
    $or: [{ name: regex }, { sku: regex }, { description: regex }],
    isDeleted: false,
    status: { $in: ["published", "PUBLISHED", "active", "ACTIVE"] },
  })
    .limit(20)
    .populate("category", "name slug");

  return ApiResponse.success(res, "Search results", products);
});

export const downloadProductCertificate = asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
  const { id } = req.params;

  let query: any = { isDeleted: false };
  if (Types.ObjectId.isValid(id)) {
    query._id = id;
  } else {
    query.$or = [{ slug: id.toLowerCase().trim() }, { sku: id.toUpperCase().trim() }];
  }

  const product = await Product.findOne(query);
  if (!product) {
    throw ApiError.notFound("Product not found for certificate generation");
  }

  res.setHeader("Content-Type", "application/pdf");
  res.setHeader("Content-Disposition", `inline; filename="Certificate-${product.sku}.pdf"`);

  const { generateCertificatePdf } = await import("../services/pdf.service");
  await generateCertificatePdf(product, res);
});
