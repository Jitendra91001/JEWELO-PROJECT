import { Response } from "express";
import { asyncHandler } from "../utils/asyncHandler";
import { ApiResponse } from "../utils/ApiResponse";
import { ApiError } from "../utils/ApiError";
import { ReturnRequest, Order, OrderItem } from "../models";
import { AuthenticatedRequest } from "../types";
import { parsePaginationParams } from "../utils/pagination";
import { uploadToCloudinary, CLOUDINARY_FOLDERS } from "../services/cloudinary.service";
import { logAudit } from "../services/audit.service";
import { RETURN_STATUS, ORDER_STATUS, USER_ROLES } from "../constants";

export const createReturnRequest = asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
  if (!req.user) throw ApiError.unauthorized("Authentication required");

  const { orderId, items, reasonCategory, reasonDetails } = req.body;

  const order = await Order.findOne({ _id: orderId, user: req.user.id });
  if (!order) {
    throw ApiError.notFound("Order not found or does not belong to you");
  }

  if (order.orderStatus !== ORDER_STATUS.DELIVERED) {
    throw ApiError.badRequest("Return requests can only be initiated for orders that have been successfully delivered");
  }

  // 14-day luxury return policy check
  if (order.deliveredAt) {
    const daysSinceDelivery = (Date.now() - new Date(order.deliveredAt).getTime()) / (1000 * 60 * 60 * 24);
    if (daysSinceDelivery > 14) {
      throw ApiError.badRequest("Return eligibility window of 14 days from delivery date has elapsed");
    }
  }

  // Check for existing active return on this order
  const existingActiveReturn = await ReturnRequest.findOne({
    order: orderId,
    status: { $nin: [RETURN_STATUS.REJECTED, RETURN_STATUS.CANCELLED, RETURN_STATUS.REFUNDED] },
  });
  if (existingActiveReturn) {
    throw ApiError.conflict("An active return request is already in progress for this order");
  }

  // Parse items
  const parsedItems = typeof items === "string" ? JSON.parse(items) : items;

  // Optional proof images via Cloudinary
  const images: string[] = [];
  if (req.files && Array.isArray(req.files)) {
    for (const file of req.files as Express.Multer.File[]) {
      const upload = await uploadToCloudinary(file.buffer, CLOUDINARY_FOLDERS.PRODUCTS);
      images.push(upload.secure_url);
    }
  }

  const returnReq = await ReturnRequest.create({
    order: order._id,
    user: req.user.id,
    items: parsedItems,
    reasonCategory,
    reasonDetails,
    images,
    status: RETURN_STATUS.REQUESTED,
  });

  order.orderStatus = ORDER_STATUS.RETURN_REQUESTED;
  await order.save();

  await logAudit(req, {
    action: "RETURN_REQUEST_CREATE",
    module: "RETURN",
    entityId: returnReq._id.toString(),
    entityType: "ReturnRequest",
    changes: { after: { returnNumber: returnReq.returnNumber, orderId } },
  });

  return ApiResponse.created(res, "Return request submitted successfully", returnReq);
});

export const getCustomerReturns = asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
  if (!req.user) throw ApiError.unauthorized("Authentication required");

  const { page, limit, skip } = parsePaginationParams(req);

  const [returns, total] = await Promise.all([
    ReturnRequest.find({ user: req.user.id })
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .populate("order", "orderNumber totalAmount orderStatus"),
    ReturnRequest.countDocuments({ user: req.user.id }),
  ]);

  return ApiResponse.paginated(res, "Return requests retrieved successfully", returns, page, limit, total);
});

export const getReturnById = asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
  const { id } = req.params;

  const returnReq = await ReturnRequest.findById(id)
    .populate("order")
    .populate("user", "name email phone")
    .populate("items.orderItem");

  if (!returnReq) {
    throw ApiError.notFound("Return request not found");
  }

  if (
    req.user?.role === USER_ROLES.CUSTOMER &&
    returnReq.user._id.toString() !== req.user.id
  ) {
    throw ApiError.forbidden("Access denied to requested return record");
  }

  return ApiResponse.success(res, "Return request retrieved successfully", returnReq);
});

export const cancelReturnRequest = asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
  if (!req.user) throw ApiError.unauthorized("Authentication required");

  const { id } = req.params;

  const returnReq = await ReturnRequest.findOne({ _id: id, user: req.user.id });
  if (!returnReq) {
    throw ApiError.notFound("Return request not found");
  }

  if (returnReq.status !== RETURN_STATUS.REQUESTED) {
    throw ApiError.badRequest("Return request cannot be cancelled once processed or pickup scheduled");
  }

  returnReq.status = RETURN_STATUS.CANCELLED;
  await returnReq.save();

  await Order.findByIdAndUpdate(returnReq.order, { orderStatus: ORDER_STATUS.DELIVERED });

  return ApiResponse.success(res, "Return request cancelled successfully");
});

// Admin Return Management
export const getAdminReturns = asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
  const { page, limit, skip } = parsePaginationParams(req);
  const { status } = req.query as Record<string, string>;

  const filter: any = {};
  if (status && status !== "ALL") {
    filter.status = status.toUpperCase();
  }

  const [returns, total] = await Promise.all([
    ReturnRequest.find(filter)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .populate("order", "orderNumber totalAmount")
      .populate("user", "name email phone"),
    ReturnRequest.countDocuments(filter),
  ]);

  return ApiResponse.paginated(res, "Admin returns retrieved successfully", returns, page, limit, total);
});

export const approveReturn = asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
  const { id } = req.params;
  const { pickupDate, adminNotes } = req.body;

  const returnReq = await ReturnRequest.findById(id);
  if (!returnReq) throw ApiError.notFound("Return request not found");

  returnReq.status = RETURN_STATUS.APPROVED;
  returnReq.pickupDate = pickupDate ? new Date(pickupDate) : new Date(Date.now() + 2 * 24 * 60 * 60 * 1000);
  if (adminNotes) returnReq.adminNotes = adminNotes;
  returnReq.processedBy = req.user?.id as any;
  await returnReq.save();

  await logAudit(req, {
    action: "RETURN_APPROVE",
    module: "RETURN",
    entityId: id,
    entityType: "ReturnRequest",
  });

  return ApiResponse.success(res, "Return approved and transit pickup scheduled", returnReq);
});

export const rejectReturn = asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
  const { id } = req.params;
  const { rejectionReason, adminNotes } = req.body;

  const returnReq = await ReturnRequest.findById(id);
  if (!returnReq) throw ApiError.notFound("Return request not found");

  returnReq.status = RETURN_STATUS.REJECTED;
  returnReq.rejectionReason = rejectionReason || "Items do not meet returns eligibility criteria";
  if (adminNotes) returnReq.adminNotes = adminNotes;
  returnReq.processedBy = req.user?.id as any;
  await returnReq.save();

  await Order.findByIdAndUpdate(returnReq.order, { orderStatus: ORDER_STATUS.DELIVERED });

  await logAudit(req, {
    action: "RETURN_REJECT",
    module: "RETURN",
    entityId: id,
    entityType: "ReturnRequest",
    changes: { after: { reason: returnReq.rejectionReason } },
  });

  return ApiResponse.success(res, "Return request rejected", returnReq);
});

export const markReturnReceived = asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
  const { id } = req.params;
  const { adminNotes } = req.body;

  const returnReq = await ReturnRequest.findById(id);
  if (!returnReq) throw ApiError.notFound("Return request not found");

  returnReq.status = RETURN_STATUS.RECEIVED;
  if (adminNotes) returnReq.adminNotes = adminNotes;
  await returnReq.save();

  return ApiResponse.success(res, "Return package received and ready for inspection", returnReq);
});

export const processReturnRefund = asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
  const { id } = req.params;
  const { refundAmount } = req.body;

  const returnReq = await ReturnRequest.findById(id).populate("order");
  if (!returnReq) throw ApiError.notFound("Return request not found");

  const order = returnReq.order as any;
  const amountToRefund = refundAmount !== undefined ? Number(refundAmount) : order.totalAmount;

  returnReq.status = RETURN_STATUS.REFUNDED;
  returnReq.refundAmount = amountToRefund;
  await returnReq.save();

  order.orderStatus = ORDER_STATUS.RETURNED;
  await order.save();

  await logAudit(req, {
    action: "RETURN_REFUND_ISSUED",
    module: "RETURN",
    entityId: id,
    entityType: "ReturnRequest",
    changes: { after: { refundAmount: amountToRefund } },
  });

  return ApiResponse.success(res, `Refund of ₹${amountToRefund} authorized successfully`, returnReq);
});
