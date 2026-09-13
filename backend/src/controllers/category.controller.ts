import { Response } from "express";
import { Types } from "mongoose";
import { asyncHandler } from "../utils/asyncHandler";
import { ApiResponse } from "../utils/ApiResponse";
import { ApiError } from "../utils/ApiError";
import { Category } from "../models";
import { AuthenticatedRequest } from "../types";
import { parsePaginationParams } from "../utils/pagination";
import { uploadToCloudinary, CLOUDINARY_FOLDERS } from "../services/cloudinary.service";
import { logAudit } from "../services/audit.service";

/**
 * Checks if assigning proposedParentId to categoryId would create an infinite circular hierarchy
 */
const hasCircularRelationship = async (categoryId: string, proposedParentId: string): Promise<boolean> => {
  if (categoryId.toString() === proposedParentId.toString()) return true;

  let currentParentId: any = proposedParentId;
  const visited = new Set<string>();

  while (currentParentId) {
    if (visited.has(currentParentId.toString())) return true;
    visited.add(currentParentId.toString());

    if (currentParentId.toString() === categoryId.toString()) {
      return true;
    }

    const parentDoc = await Category.findById(currentParentId);
    currentParentId = parentDoc ? parentDoc.parentCategory : null;
  }

  return false;
};

export const getCategories = asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
  const { search, status, active, hierarchical = "false" } = req.query as Record<string, string>;

  const filter: any = { isDeleted: false };

  // Status filtering
  if (status) {
    filter.isActive = status.toUpperCase() === "ACTIVE";
  } else if (active !== undefined && active !== "all") {
    filter.isActive = active === "true" || active === "1";
  }

  // Search keyword
  if (search) {
    filter.$or = [
      { name: { $regex: search, $options: "i" } },
      { slug: { $regex: search, $options: "i" } },
      { description: { $regex: search, $options: "i" } },
    ];
  }

  if (hierarchical === "true") {
    const allCategories = await Category.find(filter)
      .sort({ level: 1, sortOrder: 1, name: 1 })
      .lean();

    // Build recursive category tree
    const categoryMap = new Map<string, any>();
    allCategories.forEach((c: any) => categoryMap.set(c._id.toString(), { ...c, children: [] }));

    const rootCategories: any[] = [];
    allCategories.forEach((c: any) => {
      if (c.parentCategory && categoryMap.has(c.parentCategory.toString())) {
        categoryMap.get(c.parentCategory.toString()).children.push(categoryMap.get(c._id.toString()));
      } else {
        rootCategories.push(categoryMap.get(c._id.toString()));
      }
    });

    return ApiResponse.success(res, "Hierarchical categories retrieved successfully", rootCategories);
  }

  const { page, limit, skip } = parsePaginationParams(req);

  const [categories, total] = await Promise.all([
    Category.find(filter)
      .sort({ level: 1, sortOrder: 1, name: 1 })
      .skip(skip)
      .limit(limit)
      .populate("parentCategory", "name slug level"),
    Category.countDocuments(filter),
  ]);

  return ApiResponse.paginated(res, "Categories retrieved successfully", categories, page, limit, total);
});

export const getCategoryById = asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
  const { id } = req.params;

  let query: any = { isDeleted: false };
  if (Types.ObjectId.isValid(id)) {
    query._id = id;
  } else {
    query.slug = id.toLowerCase().trim();
  }

  const category = await Category.findOne(query).populate("parentCategory", "name slug level");
  if (!category) {
    throw ApiError.notFound("Category not found");
  }

  // Also retrieve child subcategories
  const subcategories = await Category.find({ parentCategory: category._id, isDeleted: false }).sort({ sortOrder: 1 });

  return ApiResponse.success(res, "Category retrieved successfully", {
    ...category.toObject(),
    subcategories,
  });
});

export const createCategory = asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
  const { name, slug, description, parentCategory, sortOrder, status, seo } = req.body;

  let finalSlug = slug;
  if (!finalSlug && name) {
    finalSlug = name
      .toLowerCase()
      .trim()
      .replace(/[^\w\s-]/g, "")
      .replace(/[\s_-]+/g, "-");
  }

  const existingSlug = await Category.findOne({ slug: finalSlug, isDeleted: false });
  if (existingSlug) {
    throw ApiError.conflict(`Category slug "${finalSlug}" is already in use`);
  }

  let calculatedLevel = 1;
  let resolvedParentId = null;

  if (parentCategory && Types.ObjectId.isValid(parentCategory)) {
    const parentDoc = await Category.findOne({ _id: parentCategory, isDeleted: false });
    if (!parentDoc) {
      throw ApiError.badRequest("Specified parent category does not exist");
    }
    calculatedLevel = (parentDoc.level || 1) + 1;
    resolvedParentId = parentDoc._id;
  }

  // Handle image upload through Cloudinary if present
  let imageUrl = req.body.image || null;
  if (req.file) {
    const uploadResult = await uploadToCloudinary(req.file.buffer, CLOUDINARY_FOLDERS.CATEGORIES);
    imageUrl = uploadResult.secure_url;
  }

  const category = await Category.create({
    name: name.trim(),
    slug: finalSlug,
    description,
    image: imageUrl,
    parentCategory: resolvedParentId,
    level: calculatedLevel,
    sortOrder: Number(sortOrder) || 0,
    isActive: status ? status.toUpperCase() === "ACTIVE" : true,
    seo: typeof seo === "string" ? JSON.parse(seo) : seo,
  });

  await logAudit(req, {
    action: "CATEGORY_CREATE",
    module: "CATEGORY",
    entityId: category._id.toString(),
    entityType: "Category",
    changes: { after: { name: category.name, slug: category.slug } },
  });

  return ApiResponse.created(res, "Category created successfully", category);
});

export const updateCategory = asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
  const { id } = req.params;
  const { name, slug, description, parentCategory, sortOrder, status, seo } = req.body;

  const category = await Category.findOne({ _id: id, isDeleted: false });
  if (!category) {
    throw ApiError.notFound("Category not found");
  }

  if (slug && slug.toLowerCase().trim() !== category.slug) {
    const existingSlug = await Category.findOne({
      slug: slug.toLowerCase().trim(),
      _id: { $ne: id },
      isDeleted: false,
    });
    if (existingSlug) {
      throw ApiError.conflict(`Category slug "${slug}" already in use`);
    }
    category.slug = slug.toLowerCase().trim();
  }

  // Validate circular dependency if parentCategory changed
  if (parentCategory !== undefined) {
    if (parentCategory && Types.ObjectId.isValid(parentCategory)) {
      const isCircular = await hasCircularRelationship(id, parentCategory);
      if (isCircular) {
        throw ApiError.badRequest("Circular parent relationship detected. A category cannot be its own ancestor.");
      }

      const parentDoc = await Category.findOne({ _id: parentCategory, isDeleted: false });
      if (!parentDoc) {
        throw ApiError.badRequest("Specified parent category does not exist");
      }
      category.parentCategory = parentDoc._id;
      category.level = (parentDoc.level || 1) + 1;
    } else {
      category.parentCategory = null as any;
      category.level = 1;
    }
  }

  if (name) category.name = name.trim();
  if (description !== undefined) category.description = description;
  if (sortOrder !== undefined) category.sortOrder = Number(sortOrder);
  if (status !== undefined) category.isActive = status.toUpperCase() === "ACTIVE";
  if (seo !== undefined) category.seo = typeof seo === "string" ? JSON.parse(seo) : seo;

  // Cloudinary image upload replacement
  if (req.file) {
    const uploadResult = await uploadToCloudinary(req.file.buffer, CLOUDINARY_FOLDERS.CATEGORIES);
    category.image = uploadResult.secure_url;
  } else if (req.body.image !== undefined) {
    category.image = req.body.image;
  }

  await category.save();

  await logAudit(req, {
    action: "CATEGORY_UPDATE",
    module: "CATEGORY",
    entityId: id,
    entityType: "Category",
    changes: { after: { name: category.name, slug: category.slug } },
  });

  return ApiResponse.success(res, "Category updated successfully", category);
});

export const deleteCategory = asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
  const { id } = req.params;

  const category = await Category.findOne({ _id: id, isDeleted: false });
  if (!category) {
    throw ApiError.notFound("Category not found");
  }

  // Check if category has active children
  const childrenCount = await Category.countDocuments({ parentCategory: id, isDeleted: false });
  if (childrenCount > 0) {
    throw ApiError.badRequest(
      `Cannot delete category "${category.name}". It contains ${childrenCount} subcategories. Reassign or delete subcategories first.`
    );
  }

  category.isDeleted = true;
  category.deletedAt = new Date();
  category.isActive = false;
  await category.save();

  await logAudit(req, {
    action: "CATEGORY_DELETE",
    module: "CATEGORY",
    entityId: id,
    entityType: "Category",
  });

  return ApiResponse.success(res, "Category deleted successfully");
});

export const toggleCategoryStatus = asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
  const { id } = req.params;

  const category = await Category.findOne({ _id: id, isDeleted: false });
  if (!category) {
    throw ApiError.notFound("Category not found");
  }

  category.isActive = !category.isActive;
  await category.save();

  await logAudit(req, {
    action: "CATEGORY_STATUS_TOGGLE",
    module: "CATEGORY",
    entityId: id,
    entityType: "Category",
    changes: { after: { isActive: category.isActive } },
  });

  return ApiResponse.success(res, "Category status toggled successfully", category);
});
