import { Response } from "express";
import { asyncHandler } from "../utils/asyncHandler";
import { ApiResponse } from "../utils/ApiResponse";
import { ApiError } from "../utils/ApiError";
import { User, Role, Order, Product, Inventory } from "../models";
import { AuthenticatedRequest } from "../types";
import { parsePaginationParams } from "../utils/pagination";
import { logAudit } from "../services/audit.service";
import { USER_ROLES, ORDER_STATUS } from "../constants";

const parseDateFilter = (period?: string, startDate?: string, endDate?: string) => {
  const now = new Date();
  let start: Date | null = null;

  if (period === "today") {
    start = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  } else if (period === "week") {
    start = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
  } else if (period === "month") {
    start = new Date(now.getFullYear(), now.getMonth(), 1);
  } else if (period === "year") {
    start = new Date(now.getFullYear(), 0, 1);
  } else if (period === "custom" && startDate) {
    start = new Date(startDate);
  }

  const dateMatch: any = {};
  if (start) dateMatch.$gte = start;
  if (period === "custom" && endDate) dateMatch.$lte = new Date(endDate);

  return Object.keys(dateMatch).length > 0 ? dateMatch : null;
};

export const getDashboardStats = asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
  const { period = "month", startDate, endDate } = req.query as Record<string, string>;
  const dateMatch = parseDateFilter(period, startDate, endDate);

  const orderMatch: any = {};
  if (dateMatch) orderMatch.createdAt = dateMatch;

  const [
    totalCustomers,
    totalProducts,
    ordersAgg,
    inventoryAgg,
    recentOrders,
  ] = await Promise.all([
    User.countDocuments({ isDeleted: false }),
    Product.countDocuments({ isDeleted: false }),
    Order.aggregate([
      { $match: orderMatch },
      {
        $group: {
          _id: null,
          totalRevenue: {
            $sum: { $cond: [{ $ne: ["$orderStatus", ORDER_STATUS.CANCELLED] }, "$totalAmount", 0] },
          },
          totalOrders: { $sum: 1 },
          pendingOrders: { $sum: { $cond: [{ $eq: ["$orderStatus", ORDER_STATUS.PENDING] }, 1, 0] } },
          deliveredOrders: { $sum: { $cond: [{ $eq: ["$orderStatus", ORDER_STATUS.DELIVERED] }, 1, 0] } },
          cancelledOrders: { $sum: { $cond: [{ $eq: ["$orderStatus", ORDER_STATUS.CANCELLED] }, 1, 0] } },
          returnedOrders: { $sum: { $cond: [{ $eq: ["$orderStatus", ORDER_STATUS.RETURNED] }, 1, 0] } },
        },
      },
    ]),
    Product.aggregate([
      { $match: { isDeleted: false } },
      {
        $group: {
          _id: null,
          lowStockCount: { $sum: { $cond: [{ $and: [{ $lte: ["$stock", "$safetyThreshold"] }, { $gt: ["$stock", 0] }] }, 1, 0] } },
          outOfStockCount: { $sum: { $cond: [{ $eq: ["$stock", 0] }, 1, 0] } },
        },
      },
    ]),
    Order.find()
      .sort({ createdAt: -1 })
      .limit(8)
      .populate("user", "name email phone"),
  ]);

  const stats = ordersAgg[0] || {
    totalRevenue: 0,
    totalOrders: 0,
    pendingOrders: 0,
    deliveredOrders: 0,
    cancelledOrders: 0,
    returnedOrders: 0,
  };

  const invStats = inventoryAgg[0] || { lowStockCount: 0, outOfStockCount: 0 };

  return ApiResponse.success(res, "Dashboard analytics retrieved successfully", {
    metrics: {
      totalSales: stats.totalRevenue,
      totalRevenue: stats.totalRevenue,
      totalOrders: stats.totalOrders,
      totalCustomers,
      totalProducts,
      pendingOrders: stats.pendingOrders,
      deliveredOrders: stats.deliveredOrders,
      cancelledOrders: stats.cancelledOrders,
      returnedOrders: stats.returnedOrders,
      lowStockProducts: invStats.lowStockCount,
      outOfStockProducts: invStats.outOfStockCount,
    },
    recentOrders,
    filterPeriod: period,
  });
});

export const getDashboardRevenue = asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
  const { period = "month", startDate, endDate } = req.query as Record<string, string>;
  const dateMatch = parseDateFilter(period, startDate, endDate);

  const match: any = { orderStatus: { $ne: ORDER_STATUS.CANCELLED } };
  if (dateMatch) match.createdAt = dateMatch;

  const revenueTimeline = await Order.aggregate([
    { $match: match },
    {
      $group: {
        _id: { $dateToString: { format: "%Y-%m-%d", date: "$createdAt" } },
        revenue: { $sum: "$totalAmount" },
        orders: { $sum: 1 },
      },
    },
    { $sort: { _id: 1 } },
  ]);

  return ApiResponse.success(res, "Revenue analytics timeline retrieved", revenueTimeline);
});

export const getDashboardOrders = asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
  const { period = "month", startDate, endDate } = req.query as Record<string, string>;
  const dateMatch = parseDateFilter(period, startDate, endDate);

  const match: any = {};
  if (dateMatch) match.createdAt = dateMatch;

  const ordersByStatus = await Order.aggregate([
    { $match: match },
    {
      $group: {
        _id: "$orderStatus",
        count: { $sum: 1 },
        totalAmount: { $sum: "$totalAmount" },
      },
    },
  ]);

  return ApiResponse.success(res, "Order distribution retrieved", ordersByStatus);
});

export const getDashboardProducts = asyncHandler(async (_req: AuthenticatedRequest, res: Response) => {
  const [totalProducts, categoryDistribution, metalDistribution] = await Promise.all([
    Product.countDocuments({ isDeleted: false }),
    Product.aggregate([
      { $match: { isDeleted: false } },
      { $group: { _id: "$category", count: { $sum: 1 } } },
      { $lookup: { from: "categories", localField: "_id", foreignField: "_id", as: "cat" } },
      { $unwind: "$cat" },
      { $project: { categoryName: "$cat.name", count: 1 } },
    ]),
    Product.aggregate([
      { $match: { isDeleted: false } },
      { $group: { _id: "$metalType", count: { $sum: 1 } } },
    ]),
  ]);

  return ApiResponse.success(res, "Product metrics retrieved", {
    totalProducts,
    categoryDistribution,
    metalDistribution,
  });
});

export const getDashboardCustomers = asyncHandler(async (_req: AuthenticatedRequest, res: Response) => {
  const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);

  const [totalUsers, activeUsers, newCustomersThisMonth] = await Promise.all([
    User.countDocuments({ isDeleted: false }),
    User.countDocuments({ isDeleted: false, isActive: true }),
    User.countDocuments({ isDeleted: false, createdAt: { $gte: thirtyDaysAgo } }),
  ]);

  return ApiResponse.success(res, "Customer acquisition metrics", {
    totalUsers,
    activeUsers,
    newCustomersThisMonth,
  });
});

export const getDashboardInventory = asyncHandler(async (_req: AuthenticatedRequest, res: Response) => {
  const [inventoryStats, criticalStockItems] = await Promise.all([
    Inventory.aggregate([
      { $match: { isDeleted: false } },
      {
        $group: {
          _id: "$status",
          count: { $sum: 1 },
          totalQuantity: { $sum: "$totalQuantity" },
          reservedQuantity: { $sum: "$reservedQuantity" },
        },
      },
    ]),
    Product.find({ stock: { $lte: 5 }, isDeleted: false })
      .select("name sku stock safetyThreshold thumbnail price")
      .limit(10),
  ]);

  return ApiResponse.success(res, "Inventory status summary", {
    inventoryStats,
    criticalStockItems,
  });
});

export const getUsers = asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
  const { page, limit, skip } = parsePaginationParams(req);
  const { search } = req.query as Record<string, string>;

  const filter: any = { isDeleted: false };
  if (search) {
    filter.$or = [
      { name: new RegExp(search, "i") },
      { email: new RegExp(search, "i") },
      { phone: new RegExp(search, "i") },
    ];
  }

  const [users, total] = await Promise.all([
    User.find(filter)
      .select("-password")
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .populate("role"),
    User.countDocuments(filter),
  ]);

  const mapped = users.map((u) => ({
    id: u._id,
    name: u.name,
    email: u.email,
    phone: u.phone,
    role: (u.role as any)?.code || USER_ROLES.CUSTOMER,
    roleName: (u.role as any)?.name || "Customer",
    isActive: u.isActive,
    isEmailVerified: u.isEmailVerified,
    createdAt: u.createdAt,
    lastLogin: u.lastLoginAt,
  }));

  return ApiResponse.paginated(res, "Users retrieved successfully", mapped, page, limit, total);
});

export const updateUserRole = asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
  const { id } = req.params;
  const { role } = req.body;

  if (req.user?.id === id && req.user?.role !== USER_ROLES.SUPER_ADMIN) {
    throw ApiError.forbidden("Self-role modification is prevented");
  }

  const user = await User.findOne({ _id: id, isDeleted: false });
  if (!user) throw ApiError.notFound("User not found");

  let roleDoc = await Role.findOne({
    $or: [{ code: String(role).toUpperCase() }, { _id: role }],
  });

  if (!roleDoc) {
    roleDoc = await Role.create({
      code: String(role).toUpperCase(),
      name: role,
      permissions: [],
      isSystem: false,
    });
  }

  user.role = roleDoc._id as any;
  await user.save();

  await logAudit(req, {
    action: "USER_ROLE_CHANGE",
    module: "USERS",
    entityId: id,
    entityType: "User",
    changes: { after: { role: roleDoc.code } },
  });

  return ApiResponse.success(res, "User role updated successfully", {
    id: user._id,
    name: user.name,
    role: roleDoc.code,
  });
});

export const toggleUserStatus = asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
  const { id } = req.params;

  if (req.user?.id === id) {
    throw ApiError.badRequest("You cannot deactivate your own administrative account");
  }

  const user = await User.findOne({ _id: id, isDeleted: false }).populate("role");
  if (!user) throw ApiError.notFound("User not found");

  if ((user.role as any)?.code === USER_ROLES.SUPER_ADMIN) {
    throw ApiError.forbidden("SUPER_ADMIN accounts cannot be deactivated");
  }

  user.isActive = !user.isActive;
  await user.save();

  await logAudit(req, {
    action: "USER_STATUS_TOGGLE",
    module: "USERS",
    entityId: id,
    entityType: "User",
    changes: { after: { isActive: user.isActive } },
  });

  return ApiResponse.success(res, "User status updated successfully", {
    id: user._id,
    name: user.name,
    isActive: user.isActive,
  });
});

export const getRoles = asyncHandler(async (_req: AuthenticatedRequest, res: Response) => {
  const roles = await Role.find().populate("permissions");
  return ApiResponse.success(res, "Roles retrieved successfully", roles);
});
