import { Response } from "express";
import { asyncHandler } from "../utils/asyncHandler";
import { ApiResponse } from "../utils/ApiResponse";
import { ApiError } from "../utils/ApiError";
import { Coupon, Order } from "../models";
import { AuthenticatedRequest } from "../types";
import { parsePaginationParams } from "../utils/pagination";
import { logAudit } from "../services/audit.service";

export const getCoupons = asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
  const { page, limit, skip } = parsePaginationParams(req);
  const { search, status } = req.query as Record<string, string>;

  const filter: any = { isDeleted: false };
  if (status !== undefined && status !== "ALL") {
    filter.isActive = status === "active" || status === "true";
  }

  if (search) {
    filter.code = new RegExp(search, "i");
  }

  const [coupons, total] = await Promise.all([
    Coupon.find(filter).sort({ createdAt: -1 }).skip(skip).limit(limit),
    Coupon.countDocuments(filter),
  ]);

  return ApiResponse.paginated(res, "Coupons retrieved successfully", coupons, page, limit, total);
});

export const getCouponById = asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
  const { id } = req.params;

  const coupon = await Coupon.findOne({ _id: id, isDeleted: false })
    .populate("applicableCategories", "name slug")
    .populate("applicableProducts", "name sku");

  if (!coupon) {
    throw ApiError.notFound("Coupon not found");
  }

  return ApiResponse.success(res, "Coupon retrieved successfully", coupon);
});

export const createCoupon = asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
  const {
    code,
    description,
    discountType,
    discountValue,
    minimumOrderAmount,
    minOrderValue,
    maximumDiscount,
    maxDiscountAmount,
    usageLimit,
    perCustomerLimit,
    userUsageLimit,
    startDate,
    endDate,
    applicableProducts,
    applicableCategories,
    status,
    isActive,
  } = req.body;

  const normalizedCode = String(code).toUpperCase().trim();
  const existing = await Coupon.findOne({ code: normalizedCode, isDeleted: false });
  if (existing) {
    throw ApiError.conflict(`Coupon code "${normalizedCode}" already exists`);
  }

  const coupon = await Coupon.create({
    code: normalizedCode,
    description,
    discountType,
    discountValue: Number(discountValue),
    minOrderValue: Number(minimumOrderAmount || minOrderValue) || 0,
    maxDiscountAmount: maximumDiscount || maxDiscountAmount ? Number(maximumDiscount || maxDiscountAmount) : null,
    usageLimit: usageLimit ? Number(usageLimit) : null,
    userUsageLimit: Number(perCustomerLimit || userUsageLimit) || 1,
    startDate: startDate ? new Date(startDate) : new Date(),
    endDate: new Date(endDate),
    applicableProducts: applicableProducts || [],
    applicableCategories: applicableCategories || [],
    isActive: status ? status.toUpperCase() === "ACTIVE" : isActive !== undefined ? Boolean(isActive) : true,
    createdBy: req.user?.id,
  });

  await logAudit(req, {
    action: "COUPON_CREATE",
    module: "COUPON",
    entityId: coupon._id.toString(),
    entityType: "Coupon",
    changes: { after: { code: coupon.code, discountValue: coupon.discountValue } },
  });

  return ApiResponse.created(res, "Coupon created successfully", coupon);
});

export const updateCoupon = asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
  const { id } = req.params;

  const coupon = await Coupon.findOne({ _id: id, isDeleted: false });
  if (!coupon) {
    throw ApiError.notFound("Coupon not found");
  }

  const {
    code,
    minimumOrderAmount,
    maximumDiscount,
    perCustomerLimit,
    status,
    ...rest
  } = req.body;

  if (code && code.toUpperCase().trim() !== coupon.code) {
    const existing = await Coupon.findOne({
      code: code.toUpperCase().trim(),
      _id: { $ne: id },
      isDeleted: false,
    });
    if (existing) {
      throw ApiError.conflict(`Coupon code "${code}" already exists`);
    }
    coupon.code = code.toUpperCase().trim();
  }

  if (minimumOrderAmount !== undefined) coupon.minOrderValue = Number(minimumOrderAmount);
  if (maximumDiscount !== undefined) coupon.maxDiscountAmount = Number(maximumDiscount);
  if (perCustomerLimit !== undefined) coupon.userUsageLimit = Number(perCustomerLimit);
  if (status !== undefined) coupon.isActive = status.toUpperCase() === "ACTIVE";

  Object.assign(coupon, rest);
  await coupon.save();

  await logAudit(req, {
    action: "COUPON_UPDATE",
    module: "COUPON",
    entityId: id,
    entityType: "Coupon",
  });

  return ApiResponse.success(res, "Coupon updated successfully", coupon);
});

export const deleteCoupon = asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
  const { id } = req.params;

  const coupon = await Coupon.findOne({ _id: id, isDeleted: false });
  if (!coupon) {
    throw ApiError.notFound("Coupon not found");
  }

  coupon.isDeleted = true;
  coupon.deletedAt = new Date();
  await coupon.save();

  await logAudit(req, {
    action: "COUPON_DELETE",
    module: "COUPON",
    entityId: id,
    entityType: "Coupon",
  });

  return ApiResponse.success(res, "Coupon deleted successfully");
});

export const toggleCouponStatus = asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
  const { id } = req.params;

  const coupon = await Coupon.findOne({ _id: id, isDeleted: false });
  if (!coupon) {
    throw ApiError.notFound("Coupon not found");
  }

  coupon.isActive = !coupon.isActive;
  await coupon.save();

  await logAudit(req, {
    action: "COUPON_STATUS_TOGGLE",
    module: "COUPON",
    entityId: id,
    entityType: "Coupon",
    changes: { after: { isActive: coupon.isActive } },
  });

  return ApiResponse.success(res, "Coupon status updated successfully", coupon);
});

export const validateCoupon = asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
  const { code, amount, cartItems } = req.body;
  if (!code) throw ApiError.badRequest("Coupon code is mandatory");

  const normalizedCode = String(code).toUpperCase().trim();

  const coupon = await Coupon.findOne({
    code: normalizedCode,
    isActive: true,
    isDeleted: false,
    startDate: { $lte: new Date() },
    endDate: { $gte: new Date() },
  });

  if (!coupon) {
    throw ApiError.badRequest("Promotional code is invalid or has expired");
  }

  // Check global usage cap
  if (coupon.usageLimit && coupon.usageCount >= coupon.usageLimit) {
    throw ApiError.badRequest("This promotional coupon has reached its maximum redemption limit");
  }

  // Check per-customer usage cap if user is authenticated
  if (req.user?.id) {
    const userUsageCount = await Order.countDocuments({
      user: req.user.id,
      "coupon.code": normalizedCode,
      orderStatus: { $ne: "CANCELLED" },
    });

    if (userUsageCount >= (coupon.userUsageLimit || 1)) {
      throw ApiError.badRequest(`You have already utilized this promotional code the maximum permitted times (${coupon.userUsageLimit})`);
    }
  }

  const subtotal = Number(amount) || 0;
  if (subtotal < coupon.minOrderValue) {
    throw ApiError.badRequest(`An order subtotal of at least ₹${coupon.minOrderValue} is required to claim this offer`);
  }

  let discountAmount = 0;
  if (coupon.discountType === "PERCENTAGE") {
    discountAmount = Math.round((subtotal * coupon.discountValue) / 100);
    if (coupon.maxDiscountAmount && discountAmount > coupon.maxDiscountAmount) {
      discountAmount = coupon.maxDiscountAmount;
    }
  } else {
    discountAmount = Math.min(coupon.discountValue, subtotal);
  }

  return ApiResponse.success(res, "Promotional code is valid and applied", {
    code: coupon.code,
    discountType: coupon.discountType,
    discountValue: coupon.discountValue,
    discountAmount,
    applicableCategories: coupon.applicableCategories,
    applicableProducts: coupon.applicableProducts,
  });
});
