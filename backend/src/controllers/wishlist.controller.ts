import { Response } from "express";
import { asyncHandler } from "../utils/asyncHandler";
import { ApiResponse } from "../utils/ApiResponse";
import { ApiError } from "../utils/ApiError";
import { Wishlist, Product } from "../models";
import { AuthenticatedRequest } from "../types";

export const getWishlist = asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
  if (!req.user) throw ApiError.unauthorized("Authentication required");

  let wishlist = await Wishlist.findOne({ user: req.user.id }).populate(
    "items.product",
    "name slug price comparePrice thumbnail images inStock metalType metalPurity rating reviewsCount"
  );

  if (!wishlist) {
    wishlist = await Wishlist.create({ user: req.user.id, items: [] });
  }

  return ApiResponse.success(res, "Wishlist retrieved successfully", wishlist);
});

export const addToWishlist = asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
  if (!req.user) throw ApiError.unauthorized("Authentication required");

  const productId = req.params.productId || req.body.productId;
  if (!productId) throw ApiError.badRequest("Product ID is required");

  const product = await Product.findOne({ _id: productId, isDeleted: false });
  if (!product) {
    throw ApiError.notFound("Product not found");
  }

  let wishlist = await Wishlist.findOne({ user: req.user.id });
  if (!wishlist) {
    wishlist = new Wishlist({ user: req.user.id, items: [] });
  }

  // Prevent duplicate products
  const exists = wishlist.items.some((item) => item.product.toString() === productId);
  if (!exists) {
    wishlist.items.push({
      product: product._id,
      variant: req.body.variantId || null,
      addedAt: new Date(),
    });
    await wishlist.save();
  }

  await wishlist.populate(
    "items.product",
    "name slug price comparePrice thumbnail images inStock metalType metalPurity rating"
  );

  return ApiResponse.success(res, "Product added to wishlist", wishlist);
});

export const removeFromWishlist = asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
  if (!req.user) throw ApiError.unauthorized("Authentication required");

  const { productId } = req.params;
  const wishlist = await Wishlist.findOne({ user: req.user.id });

  if (!wishlist) {
    throw ApiError.notFound("Wishlist not found");
  }

  wishlist.items = wishlist.items.filter((item) => item.product.toString() !== productId);
  await wishlist.save();
  await wishlist.populate(
    "items.product",
    "name slug price comparePrice thumbnail images inStock metalType metalPurity rating"
  );

  return ApiResponse.success(res, "Product removed from wishlist", wishlist);
});

export const clearWishlist = asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
  if (!req.user) throw ApiError.unauthorized("Authentication required");

  const wishlist = await Wishlist.findOne({ user: req.user.id });
  if (wishlist) {
    wishlist.items = [];
    await wishlist.save();
  }

  return ApiResponse.success(res, "Wishlist cleared successfully", { items: [] });
});
