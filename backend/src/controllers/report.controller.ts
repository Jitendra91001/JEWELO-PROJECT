import { Response } from "express";
import { asyncHandler } from "../utils/asyncHandler";
import { ApiResponse } from "../utils/ApiResponse";
import { Order, Product, Category, User, Inventory, ReturnRequest } from "../models";
import { AuthenticatedRequest } from "../types";
import { ORDER_STATUS } from "../constants";

export const getSalesReport = asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
  const { startDate, endDate, status } = req.query as Record<string, string>;

  const match: any = {};
  if (status) match.orderStatus = status.toUpperCase();
  else match.orderStatus = { $ne: ORDER_STATUS.CANCELLED };

  if (startDate || endDate) {
    match.createdAt = {};
    if (startDate) match.createdAt.$gte = new Date(startDate);
    if (endDate) match.createdAt.$lte = new Date(endDate);
  }

  const [summary, salesTrend] = await Promise.all([
    Order.aggregate([
      { $match: match },
      {
        $group: {
          _id: null,
          totalRevenue: { $sum: "$totalAmount" },
          averageOrderValue: { $avg: "$totalAmount" },
          totalOrders: { $sum: 1 },
          totalDiscount: { $sum: "$discountAmount" },
          totalTax: { $sum: "$taxAmount" },
        },
      },
    ]),
    Order.aggregate([
      { $match: match },
      {
        $group: {
          _id: { $dateToString: { format: "%Y-%m-%d", date: "$createdAt" } },
          revenue: { $sum: "$totalAmount" },
          orders: { $sum: 1 },
        },
      },
      { $sort: { _id: 1 } },
    ]),
  ]);

  return ApiResponse.success(res, "Sales report retrieved successfully", {
    summary: summary[0] || {
      totalRevenue: 0,
      averageOrderValue: 0,
      totalOrders: 0,
      totalDiscount: 0,
      totalTax: 0,
    },
    salesTrend,
  });
});

export const getRevenueReport = asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
  const { startDate, endDate } = req.query as Record<string, string>;

  const match: any = { orderStatus: { $ne: ORDER_STATUS.CANCELLED } };
  if (startDate || endDate) {
    match.createdAt = {};
    if (startDate) match.createdAt.$gte = new Date(startDate);
    if (endDate) match.createdAt.$lte = new Date(endDate);
  }

  const revenueByPaymentMethod = await Order.aggregate([
    { $match: match },
    {
      $group: {
        _id: "$paymentMethod",
        revenue: { $sum: "$totalAmount" },
        count: { $sum: 1 },
      },
    },
  ]);

  return ApiResponse.success(res, "Revenue report by payment method retrieved", revenueByPaymentMethod);
});

export const getProductReport = asyncHandler(async (_req: AuthenticatedRequest, res: Response) => {
  const [topProducts, lowStockProducts, outOfStockCount] = await Promise.all([
    Product.find({ isDeleted: false })
      .sort({ reviewsCount: -1, rating: -1 })
      .limit(10)
      .select("name sku price stock rating reviewsCount"),
    Product.find({ stock: { $lte: 5, $gt: 0 }, isDeleted: false })
      .select("name sku stock safetyThreshold price"),
    Product.countDocuments({ stock: 0, isDeleted: false }),
  ]);

  return ApiResponse.success(res, "Product performance report retrieved", {
    topProducts,
    lowStockProducts,
    outOfStockCount,
  });
});

export const getCategoryReport = asyncHandler(async (_req: AuthenticatedRequest, res: Response) => {
  const categoryMetrics = await Product.aggregate([
    { $match: { isDeleted: false } },
    {
      $group: {
        _id: "$category",
        productCount: { $sum: 1 },
        totalStock: { $sum: "$stock" },
        avgPrice: { $avg: "$price" },
      },
    },
    { $lookup: { from: "categories", localField: "_id", foreignField: "_id", as: "category" } },
    { $unwind: "$category" },
    {
      $project: {
        name: "$category.name",
        slug: "$category.slug",
        productCount: 1,
        totalStock: 1,
        avgPrice: { $round: ["$avgPrice", 2] },
      },
    },
    { $sort: { productCount: -1 } },
  ]);

  return ApiResponse.success(res, "Category performance report retrieved", categoryMetrics);
});

export const getCustomerReport = asyncHandler(async (_req: AuthenticatedRequest, res: Response) => {
  const topSpenders = await Order.aggregate([
    { $match: { orderStatus: { $ne: ORDER_STATUS.CANCELLED } } },
    {
      $group: {
        _id: "$user",
        totalSpend: { $sum: "$totalAmount" },
        orderCount: { $sum: 1 },
        lastOrderDate: { $max: "$createdAt" },
      },
    },
    { $sort: { totalSpend: -1 } },
    { $limit: 15 },
    { $lookup: { from: "users", localField: "_id", foreignField: "_id", as: "user" } },
    { $unwind: "$user" },
    {
      $project: {
        name: "$user.name",
        email: "$user.email",
        phone: "$user.phone",
        totalSpend: 1,
        orderCount: 1,
        lastOrderDate: 1,
      },
    },
  ]);

  return ApiResponse.success(res, "Customer lifetime value report retrieved", topSpenders);
});

export const getInventoryReport = asyncHandler(async (_req: AuthenticatedRequest, res: Response) => {
  const [summary, warehouseBreakdown] = await Promise.all([
    Inventory.aggregate([
      { $match: { isDeleted: false } },
      {
        $group: {
          _id: null,
          totalInventoryUnits: { $sum: "$totalQuantity" },
          reservedUnits: { $sum: "$reservedQuantity" },
          soldUnits: { $sum: "$soldQuantity" },
          availableUnits: { $sum: "$availableQuantity" },
        },
      },
    ]),
    Inventory.aggregate([
      { $match: { isDeleted: false } },
      {
        $group: {
          _id: "$status",
          count: { $sum: 1 },
          totalUnits: { $sum: "$totalQuantity" },
        },
      },
    ]),
  ]);

  return ApiResponse.success(res, "Inventory audit report retrieved", {
    summary: summary[0] || {},
    statusBreakdown: warehouseBreakdown,
  });
});

export const getOrderReport = asyncHandler(async (_req: AuthenticatedRequest, res: Response) => {
  const statusSummary = await Order.aggregate([
    {
      $group: {
        _id: "$orderStatus",
        count: { $sum: 1 },
        value: { $sum: "$totalAmount" },
      },
    },
  ]);

  return ApiResponse.success(res, "Order distribution report retrieved", statusSummary);
});

export const getReturnReport = asyncHandler(async (_req: AuthenticatedRequest, res: Response) => {
  const returnMetrics = await ReturnRequest.aggregate([
    {
      $group: {
        _id: "$reasonCategory",
        count: { $sum: 1 },
        totalRefundAmount: { $sum: "$refundAmount" },
      },
    },
    { $sort: { count: -1 } },
  ]);

  return ApiResponse.success(res, "Return reasons and claim report retrieved", returnMetrics);
});
