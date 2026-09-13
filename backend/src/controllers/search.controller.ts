import { Response } from "express";
import { asyncHandler } from "../utils/asyncHandler";
import { ApiResponse } from "../utils/ApiResponse";
import { Product, Category, Collection } from "../models";
import { AuthenticatedRequest } from "../types";
import { parsePaginationParams, buildPaginationMeta } from "../utils/pagination";

// Prevent ReDoS by escaping user input
const escapeRegex = (string: string) => {
  return string.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
};

export const globalSearch = asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
  const { page, limit, skip } = parsePaginationParams(req);
  const {
    q = "",
    category,
    collection,
    priceMin,
    priceMax,
    metal,
    purity,
    gemstone,
    gender,
    rating,
    discount,
    availability,
    sort,
  } = req.query as Record<string, string>;

  const cleanQuery = q.trim().slice(0, 100); // Limit input length to 100 chars
  const productFilter: any = { isDeleted: false, status: { $in: ["published", "PUBLISHED", "active", "ACTIVE"] } };

  if (cleanQuery) {
    const escaped = escapeRegex(cleanQuery);
    const searchRegex = new RegExp(escaped, "i");

    productFilter.$or = [
      { name: searchRegex },
      { sku: searchRegex },
      { description: searchRegex },
      { shortDescription: searchRegex },
      { "seo.keywords": searchRegex },
      { tags: searchRegex },
    ];
  }

  if (category) productFilter.category = category;
  if (collection) productFilter.collectionId = collection;
  if (metal) productFilter.metalType = new RegExp(escapeRegex(metal), "i");
  if (purity) productFilter.metalPurity = purity;
  if (gender) productFilter.gender = new RegExp(escapeRegex(gender), "i");
  if (rating) productFilter.rating = { $gte: Number(rating) };
  if (discount) productFilter.discountPercentage = { $gte: Number(discount) };
  if (availability === "in_stock") productFilter.inStock = true;

  if (priceMin !== undefined || priceMax !== undefined) {
    productFilter.price = {};
    if (priceMin !== undefined) productFilter.price.$gte = Number(priceMin);
    if (priceMax !== undefined) productFilter.price.$lte = Number(priceMax);
  }

  if (gemstone) {
    productFilter["gemstones.type"] = new RegExp(escapeRegex(gemstone), "i");
  }

  // Sorting
  let sortOption: any = { createdAt: -1 };
  if (sort === "price_asc") sortOption = { price: 1 };
  else if (sort === "price_desc") sortOption = { price: -1 };
  else if (sort === "rating") sortOption = { rating: -1 };
  else if (sort === "bestseller") sortOption = { isBestseller: -1 };

  // Concurrent execution
  const [products, totalProducts, matchingCategories, matchingCollections] = await Promise.all([
    Product.find(productFilter)
      .sort(sortOption)
      .skip(skip)
      .limit(limit)
      .populate("category", "name slug")
      .populate("collectionId", "name slug"),
    Product.countDocuments(productFilter),
    cleanQuery
      ? Category.find({
          name: new RegExp(escapeRegex(cleanQuery), "i"),
          isDeleted: false,
          isActive: true,
        })
          .limit(5)
          .select("name slug image level")
      : Promise.resolve([]),
    cleanQuery
      ? Collection.find({
          name: new RegExp(escapeRegex(cleanQuery), "i"),
          status: { $in: ["active", "ACTIVE"] },
        })
          .limit(5)
          .select("name slug bannerImage thumbnailImage")
      : Promise.resolve([]),
  ]);

  return ApiResponse.success(res, "Search results retrieved successfully", {
    query: cleanQuery,
    products,
    categories: matchingCategories,
    collections: matchingCollections,
    pagination: buildPaginationMeta(totalProducts, page, limit),
  });
});
