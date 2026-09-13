import { Response } from "express";
import { asyncHandler } from "../utils/asyncHandler";
import { ApiResponse } from "../utils/ApiResponse";
import { ApiError } from "../utils/ApiError";
import { Review, Product, Order, OrderItem } from "../models";
import { AuthenticatedRequest } from "../types";
import { parsePaginationParams } from "../utils/pagination";
import { uploadToCloudinary, CLOUDINARY_FOLDERS } from "../services/cloudinary.service";
import { logAudit } from "../services/audit.service";
import { REVIEW_STATUS, ORDER_STATUS } from "../constants";

// Helper to recalculate average product ratings
const syncProductRatings = async (productId: any) => {
  const approved = await Review.find({ product: productId, status: REVIEW_STATUS.APPROVED });
  const count = approved.length;
  const avg = count > 0 ? approved.reduce((sum, r) => sum + r.rating, 0) / count : 5.0;

  await Product.findByIdAndUpdate(productId, {
    rating: Number(avg.toFixed(1)),
    reviewsCount: count,
  });
};

export const getProductReviews = asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
  const { productId } = req.params;
  const { page, limit, skip } = parsePaginationParams(req);

  const filter = { product: productId, status: REVIEW_STATUS.APPROVED };

  const [reviews, total] = await Promise.all([
    Review.find(filter)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .populate("user", "name avatar"),
    Review.countDocuments(filter),
  ]);

  return ApiResponse.paginated(res, "Reviews retrieved successfully", reviews, page, limit, total);
});

export const createReview = asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
  if (!req.user) throw ApiError.unauthorized("Authentication required");

  const productId = req.params.productId || req.body.productId;
  const { rating, title, comment } = req.body;

  const product = await Product.findOne({ _id: productId, isDeleted: false });
  if (!product) {
    throw ApiError.notFound("Product not found");
  }

  // 1. Verify customer purchased this product
  const purchasedOrder = await Order.findOne({
    user: req.user.id,
    orderStatus: { $in: [ORDER_STATUS.DELIVERED, ORDER_STATUS.SHIPPED, ORDER_STATUS.CONFIRMED] },
  }).populate({
    path: "items",
    match: { product: productId },
  });

  const hasPurchased = Boolean(purchasedOrder && (purchasedOrder.items as any[])?.length > 0);
  if (!hasPurchased && req.user.role === "CUSTOMER") {
    throw ApiError.forbidden("Only verified clients who have acquired this jewellery piece may submit a testimonial review");
  }

  // 2. Prevent duplicate reviews by same user on this product
  const existingReview = await Review.findOne({ product: productId, user: req.user.id });
  if (existingReview) {
    throw ApiError.conflict("You have already submitted a review for this jewellery piece");
  }

  // Handle uploaded images through Cloudinary
  const images: string[] = req.body.images || [];
  if (req.files && Array.isArray(req.files)) {
    for (const file of req.files as Express.Multer.File[]) {
      const upload = await uploadToCloudinary(file.buffer, CLOUDINARY_FOLDERS.REVIEWS);
      images.push(upload.secure_url);
    }
  }

  const review = await Review.create({
    product: productId,
    user: req.user.id,
    order: purchasedOrder ? purchasedOrder._id : null,
    rating: Number(rating),
    title,
    comment,
    images,
    status: REVIEW_STATUS.PENDING, // Sent to moderation queue
    isVerifiedBuyer: hasPurchased,
  });

  await logAudit(req, {
    action: "REVIEW_CREATE",
    module: "REVIEW",
    entityId: review._id.toString(),
    entityType: "Review",
  });

  return ApiResponse.created(res, "Review submitted for moderation review", review);
});

export const updateReview = asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
  if (!req.user) throw ApiError.unauthorized("Authentication required");

  const { id } = req.params;
  const { rating, title, comment } = req.body;

  const review = await Review.findOne({ _id: id, user: req.user.id });
  if (!review) {
    throw ApiError.notFound("Review not found or not owned by you");
  }

  if (rating !== undefined) review.rating = Number(rating);
  if (title !== undefined) review.title = title;
  if (comment !== undefined) review.comment = comment;
  review.status = REVIEW_STATUS.PENDING; // Re-enter moderation

  await review.save();
  await syncProductRatings(review.product);

  return ApiResponse.success(res, "Review updated and resubmitted for review", review);
});

export const deleteReview = asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
  if (!req.user) throw ApiError.unauthorized("Authentication required");

  const { id } = req.params;

  const query: any = { _id: id };
  if (req.user.role === "CUSTOMER") {
    query.user = req.user.id;
  }

  const review = await Review.findOneAndDelete(query);
  if (!review) {
    throw ApiError.notFound("Review not found");
  }

  await syncProductRatings(review.product);

  await logAudit(req, {
    action: "REVIEW_DELETE",
    module: "REVIEW",
    entityId: id,
    entityType: "Review",
  });

  return ApiResponse.success(res, "Review deleted successfully");
});

// Admin Moderation Endpoints
export const getAdminReviews = asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
  const { page, limit, skip } = parsePaginationParams(req);
  const { status } = req.query as Record<string, string>;

  const filter: any = {};
  if (status && status !== "ALL") {
    filter.status = status.toUpperCase();
  }

  const [reviews, total] = await Promise.all([
    Review.find(filter)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .populate("product", "name sku thumbnail")
      .populate("user", "name email"),
    Review.countDocuments(filter),
  ]);

  return ApiResponse.paginated(res, "Reviews retrieved successfully", reviews, page, limit, total);
});

export const approveReview = asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
  const { id } = req.params;

  const review = await Review.findById(id);
  if (!review) {
    throw ApiError.notFound("Review not found");
  }

  review.status = REVIEW_STATUS.APPROVED;
  await review.save();

  await syncProductRatings(review.product);

  await logAudit(req, {
    action: "REVIEW_APPROVE",
    module: "REVIEW",
    entityId: id,
    entityType: "Review",
  });

  return ApiResponse.success(res, "Review approved and published to product page", review);
});

export const rejectReview = asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
  const { id } = req.params;

  const review = await Review.findById(id);
  if (!review) {
    throw ApiError.notFound("Review not found");
  }

  review.status = REVIEW_STATUS.REJECTED;
  await review.save();

  await syncProductRatings(review.product);

  await logAudit(req, {
    action: "REVIEW_REJECT",
    module: "REVIEW",
    entityId: id,
    entityType: "Review",
  });

  return ApiResponse.success(res, "Review rejected", review);
});
