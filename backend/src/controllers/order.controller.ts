import { Response } from "express";
import { Types } from "mongoose";
import { asyncHandler } from "../utils/asyncHandler";
import { ApiResponse } from "../utils/ApiResponse";
import { ApiError } from "../utils/ApiError";
import { Order, OrderItem, Product, Address, Coupon, Cart } from "../models";
import { AuthenticatedRequest } from "../types";
import { parsePaginationParams } from "../utils/pagination";
import { reserveStockForOrder, releaseStockForOrder, commitSoldStockForOrder } from "../services/inventory.service";
import { logAudit } from "../services/audit.service";
import { ORDER_STATUS, PAYMENT_STATUS, USER_ROLES } from "../constants";

export const createOrder = asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
  if (!req.user) throw ApiError.unauthorized("Authentication required");

  const {
    items,
    shippingAddress,
    billingAddress,
    paymentMethod = "COD",
    couponCode,
    specialInstructions,
    isGift = false,
    giftMessage,
  } = req.body;

  let orderItemsToProcess = items;

  // If items not sent, checkout directly from user's active Cart
  if (!orderItemsToProcess || orderItemsToProcess.length === 0) {
    const userCart = await Cart.findOne({ user: req.user.id });
    if (!userCart || userCart.items.length === 0) {
      throw ApiError.badRequest("Cannot place order. Your shopping cart is empty.");
    }
    orderItemsToProcess = userCart.items.map((i: any) => ({
      productId: i.product.toString(),
      variantId: i.variant,
      quantity: i.quantity,
      selectedSize: i.selectedSize,
      metalPurity: i.metalPurity,
      engravingText: i.engravingText,
    }));
  }

  // 1. Resolve Shipping and Billing Addresses
  let resolvedShipping = shippingAddress;
  if (typeof shippingAddress === "string" && Types.ObjectId.isValid(shippingAddress)) {
    const addr = await Address.findOne({ _id: shippingAddress, user: req.user.id, isDeleted: false });
    if (!addr) throw ApiError.notFound("Shipping address not found in your address book");
    resolvedShipping = {
      fullName: addr.fullName,
      phone: addr.phone,
      addressLine1: addr.addressLine1,
      addressLine2: addr.addressLine2,
      landmark: addr.landmark,
      city: addr.city,
      state: addr.state,
      postalCode: addr.postalCode,
      country: addr.country,
    };
  }

  let resolvedBilling = billingAddress || resolvedShipping;
  if (typeof billingAddress === "string" && Types.ObjectId.isValid(billingAddress)) {
    const bAddr = await Address.findOne({ _id: billingAddress, user: req.user.id, isDeleted: false });
    if (bAddr) {
      resolvedBilling = {
        fullName: bAddr.fullName,
        phone: bAddr.phone,
        addressLine1: bAddr.addressLine1,
        addressLine2: bAddr.addressLine2,
        landmark: bAddr.landmark,
        city: bAddr.city,
        state: bAddr.state,
        postalCode: bAddr.postalCode,
        country: bAddr.country,
      };
    }
  }

  // 2. Fetch products and calculate server-side pricing
  let subtotal = 0;
  const preparedItems: any[] = [];
  const stockReservationItems: any[] = [];

  for (const item of orderItemsToProcess) {
    const product = await Product.findOne({ _id: item.productId, isDeleted: false });
    if (!product) {
      throw ApiError.notFound(`Product with ID "${item.productId}" was not found`);
    }

    if (product.stock < item.quantity) {
      throw ApiError.badRequest(
        `Insufficient stock for "${product.name}". Requested: ${item.quantity}, Available in vault: ${product.stock}`
      );
    }

    const unitPrice = product.price; // Forced database price
    const totalPrice = unitPrice * item.quantity;
    subtotal += totalPrice;

    preparedItems.push({
      product: product._id,
      variant: item.variantId || null,
      productName: product.name,
      sku: product.sku,
      image: product.thumbnail || (product.images && product.images[0]) || "",
      metalType: product.metalType,
      metalPurity: product.metalPurity,
      metalWeight: product.metalWeight,
      diamondWeightCarat: product.totalDiamondWeightCarat,
      certificateNumber: product.certification?.certificateNumber,
      selectedSize: item.selectedSize,
      engravingText: item.engravingText,
      quantity: item.quantity,
      unitPrice,
      totalPrice,
    });

    stockReservationItems.push({
      productId: product._id,
      quantity: item.quantity,
    });
  }

  // 3. Evaluate Coupon Discount server-side
  let discountAmount = 0;
  let appliedCouponSnapshot: any = undefined;

  if (couponCode) {
    const coupon = await Coupon.findOne({
      code: couponCode.toUpperCase().trim(),
      isActive: true,
      isDeleted: false,
      startDate: { $lte: new Date() },
      endDate: { $gte: new Date() },
    });

    if (coupon && subtotal >= coupon.minOrderValue) {
      if (coupon.discountType === "PERCENTAGE") {
        discountAmount = Math.round((subtotal * coupon.discountValue) / 100);
        if (coupon.maxDiscountAmount && discountAmount > coupon.maxDiscountAmount) {
          discountAmount = coupon.maxDiscountAmount;
        }
      } else {
        discountAmount = Math.min(coupon.discountValue, subtotal);
      }

      appliedCouponSnapshot = {
        code: coupon.code,
        discountType: coupon.discountType,
        discountValue: coupon.discountValue,
        discountAmount,
      };

      coupon.usageCount = (coupon.usageCount || 0) + 1;
      await coupon.save();
    }
  }

  // Standard jewellery financials
  const taxAmount = Math.round((subtotal - discountAmount) * 0.03); // 3% GST
  const shippingFee = subtotal > 50000 ? 0 : 500;
  const insuranceFee = 0; // Complimentary Maison transit insurance
  const totalAmount = Math.max(0, subtotal - discountAmount + taxAmount + shippingFee);

  // 4. Create Order document
  const order = new Order({
    user: req.user.id,
    shippingAddress: resolvedShipping,
    billingAddress: resolvedBilling,
    orderStatus: ORDER_STATUS.CONFIRMED,
    paymentStatus: PAYMENT_STATUS.PENDING,
    paymentMethod,
    subtotal,
    discountAmount,
    taxAmount,
    shippingFee,
    insuranceFee,
    totalAmount,
    coupon: appliedCouponSnapshot,
    isGift,
    giftMessage,
    specialInstructions,
    statusHistory: [
      {
        status: ORDER_STATUS.CONFIRMED,
        changedAt: new Date(),
        changedBy: req.user.id as any,
        note: "Order placed successfully by client",
      },
    ],
  });

  await order.save();

  // 5. Create OrderItems & reserve vault stock atomically
  const orderItemIds = await Promise.all(
    preparedItems.map(async (item) => {
      const doc = await OrderItem.create({ ...item, order: order._id });
      return doc._id;
    })
  );

  order.items = orderItemIds;
  await order.save();

  // Reserve stock in database
  await reserveStockForOrder(order._id, stockReservationItems, req.user.id);

  // 6. Clear shopping cart
  await Cart.findOneAndUpdate({ user: req.user.id }, { items: [], subtotal: 0, totalAmount: 0, coupon: null });

  await logAudit(req, {
    action: "ORDER_CREATE",
    module: "ORDER",
    entityId: order._id.toString(),
    entityType: "Order",
    changes: { after: { orderNumber: order.orderNumber, totalAmount: order.totalAmount } },
  });

  const populatedOrder = await Order.findById(order._id).populate("items");
  return ApiResponse.created(res, "Order placed successfully", populatedOrder);
});

export const getMyOrders = asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
  if (!req.user) throw ApiError.unauthorized("Authentication required");

  const { page, limit, skip } = parsePaginationParams(req);

  const [orders, total] = await Promise.all([
    Order.find({ user: req.user.id })
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .populate("items"),
    Order.countDocuments({ user: req.user.id }),
  ]);

  return ApiResponse.paginated(res, "Orders retrieved successfully", orders, page, limit, total);
});

export const getOrders = asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
  const { page, limit, skip } = parsePaginationParams(req);
  const { status, search, startDate, endDate } = req.query as Record<string, string>;

  const filter: any = {};
  if (status && status !== "ALL") {
    filter.orderStatus = status.toUpperCase();
  }

  if (search) {
    filter.$or = [
      { orderNumber: new RegExp(search, "i") },
      { "shippingAddress.fullName": new RegExp(search, "i") },
      { "shippingAddress.phone": new RegExp(search, "i") },
    ];
  }

  if (startDate || endDate) {
    filter.createdAt = {};
    if (startDate) filter.createdAt.$gte = new Date(startDate);
    if (endDate) filter.createdAt.$lte = new Date(endDate);
  }

  const [orders, total] = await Promise.all([
    Order.find(filter)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .populate("items")
      .populate("user", "name email phone"),
    Order.countDocuments(filter),
  ]);

  return ApiResponse.paginated(res, "Orders retrieved successfully", orders, page, limit, total);
});

export const getOrderById = asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
  const { id } = req.params;

  let query: any = {};
  if (Types.ObjectId.isValid(id)) {
    query._id = id;
  } else {
    query.orderNumber = id;
  }

  const order = await Order.findOne(query)
    .populate("items")
    .populate("user", "name email phone");

  if (!order) {
    throw ApiError.notFound("Order not found");
  }

  // Isolation check: customer can only view own order
  if (
    req.user?.role === USER_ROLES.CUSTOMER &&
    order.user._id.toString() !== req.user.id
  ) {
    throw ApiError.forbidden("Access denied to requested order");
  }

  return ApiResponse.success(res, "Order details retrieved successfully", order);
});

export const cancelOrder = asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
  const { id } = req.params;
  const { cancellationReason, reason } = req.body;

  const order = await Order.findById(id).populate("items");
  if (!order) {
    throw ApiError.notFound("Order not found");
  }

  if (
    req.user?.role === USER_ROLES.CUSTOMER &&
    order.user.toString() !== req.user.id
  ) {
    throw ApiError.forbidden("Cannot cancel an order that belongs to another customer");
  }

  if (order.orderStatus === ORDER_STATUS.DELIVERED || order.orderStatus === ORDER_STATUS.SHIPPED) {
    throw ApiError.badRequest("Orders that have already been dispatched or delivered cannot be cancelled");
  }

  const finalReason = cancellationReason || reason || "Cancelled by client";
  order.orderStatus = ORDER_STATUS.CANCELLED;
  order.cancelledAt = new Date();
  order.cancellationReason = finalReason;

  if (!order.statusHistory) order.statusHistory = [];
  order.statusHistory.push({
    status: ORDER_STATUS.CANCELLED,
    changedAt: new Date(),
    changedBy: req.user?.id as any,
    note: finalReason,
  });

  await order.save();

  // Release reserved stock back into vault
  if (order.items && Array.isArray(order.items)) {
    const itemsToRelease = (order.items as any[]).map((item) => ({
      productId: item.product,
      quantity: item.quantity,
    }));
    await releaseStockForOrder(order._id, itemsToRelease, req.user?.id);
  }

  await logAudit(req, {
    action: "ORDER_CANCEL",
    module: "ORDER",
    entityId: id,
    entityType: "Order",
    changes: { after: { status: ORDER_STATUS.CANCELLED, reason: finalReason } },
  });

  return ApiResponse.success(res, "Order cancelled successfully and stock restored", order);
});

export const updateOrderStatus = asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
  const { id } = req.params;
  const { status, trackingNumber, courierPartner, note } = req.body;

  const order = await Order.findById(id).populate("items");
  if (!order) {
    throw ApiError.notFound("Order not found");
  }

  const previousStatus = order.orderStatus;
  const targetStatus = status ? status.toUpperCase() : previousStatus;

  if (targetStatus) order.orderStatus = targetStatus;
  if (trackingNumber) order.trackingNumber = trackingNumber;
  if (courierPartner) order.courierPartner = courierPartner;

  if (targetStatus === ORDER_STATUS.DELIVERED) {
    order.deliveredAt = new Date();
    order.paymentStatus = PAYMENT_STATUS.COMPLETED;

    // Commit reserved stock to sold
    const itemsToCommit = (order.items as any[]).map((item) => ({
      productId: item.product,
      quantity: item.quantity,
    }));
    await commitSoldStockForOrder(order._id, itemsToCommit, req.user?.id);
  } else if (targetStatus === ORDER_STATUS.SHIPPED) {
    order.shippedAt = new Date();
  }

  if (!order.statusHistory) order.statusHistory = [];
  order.statusHistory.push({
    status: targetStatus,
    changedAt: new Date(),
    changedBy: req.user?.id as any,
    note: note || `Status transitioned from ${previousStatus} to ${targetStatus}`,
  });

  order.updatedBy = req.user?.id as any;
  await order.save();

  await logAudit(req, {
    action: "ORDER_STATUS_UPDATE",
    module: "ORDER",
    entityId: id,
    entityType: "Order",
    changes: { before: { status: previousStatus }, after: { status: targetStatus } },
  });

  return ApiResponse.success(res, "Order status updated successfully", order);
});

export const downloadOrderInvoice = asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
  const { id } = req.params;

  let query: any = {};
  if (Types.ObjectId.isValid(id)) {
    query._id = id;
  } else {
    query.orderNumber = id;
  }

  const order = await Order.findOne(query).populate("items");
  if (!order) {
    throw ApiError.notFound("Order not found");
  }

  // Authorization check
  if (
    req.user?.role === USER_ROLES.CUSTOMER &&
    order.user.toString() !== req.user.id
  ) {
    throw ApiError.forbidden("Access denied to invoice for this order");
  }

  res.setHeader("Content-Type", "application/pdf");
  res.setHeader("Content-Disposition", `inline; filename="Invoice-${order.orderNumber}.pdf"`);

  const { generateInvoicePdf } = await import("../services/pdf.service");
  await generateInvoicePdf(order, res);
});
