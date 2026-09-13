import { Response } from "express";
import { asyncHandler } from "../utils/asyncHandler";
import { ApiResponse } from "../utils/ApiResponse";
import { ApiError } from "../utils/ApiError";
import { Inventory, Product } from "../models";
import { AuthenticatedRequest } from "../types";
import { parsePaginationParams } from "../utils/pagination";
import { logAudit } from "../services/audit.service";
import { INVENTORY_STATUS } from "../constants";

export const getInventoryList = asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
  const { page, limit, skip } = parsePaginationParams(req);
  const { status, search } = req.query as Record<string, string>;

  const filter: any = { isDeleted: false };
  if (status) {
    filter.status = status.toUpperCase();
  }

  if (search) {
    filter.$or = [{ sku: new RegExp(search, "i") }];
  }

  const [inventories, total] = await Promise.all([
    Inventory.find(filter)
      .sort({ availableQuantity: 1 })
      .skip(skip)
      .limit(limit)
      .populate("product", "name sku thumbnail price"),
    Inventory.countDocuments(filter),
  ]);

  return ApiResponse.paginated(res, "Inventory records retrieved successfully", inventories, page, limit, total);
});

export const getProductInventory = asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
  const { productId } = req.params;

  let inventory = await Inventory.findOne({ product: productId, isDeleted: false }).populate(
    "product",
    "name sku thumbnail price"
  );

  if (!inventory) {
    const product = await Product.findById(productId);
    if (!product) {
      throw ApiError.notFound("Product not found");
    }

    inventory = await Inventory.create({
      product: product._id,
      sku: product.sku,
      totalQuantity: product.stock,
      reservedQuantity: 0,
      availableQuantity: product.stock,
      safetyThreshold: product.safetyThreshold || 5,
      status: product.stock > 0 ? INVENTORY_STATUS.IN_STOCK : INVENTORY_STATUS.OUT_OF_STOCK,
      adjustmentLogs: [],
    });
  }

  return ApiResponse.success(res, "Inventory details retrieved successfully", inventory);
});

export const adjustStock = asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
  const { productId, newQuantity, reason } = req.body;

  if (newQuantity === undefined || Number(newQuantity) < 0) {
    throw ApiError.badRequest("New quantity must be a non-negative number");
  }

  const targetQty = Number(newQuantity);
  const product = await Product.findById(productId);
  if (!product) {
    throw ApiError.notFound("Product not found");
  }

  let inventory = await Inventory.findOne({ product: productId });
  if (!inventory) {
    inventory = new Inventory({
      product: product._id,
      sku: product.sku,
      totalQuantity: targetQty,
      reservedQuantity: 0,
      availableQuantity: targetQty,
      adjustmentLogs: [],
    });
  }

  const prevTotal = inventory.totalQuantity;
  const difference = targetQty - prevTotal;

  inventory.totalQuantity = targetQty;
  inventory.availableQuantity = Math.max(0, targetQty - (inventory.reservedQuantity || 0));

  inventory.adjustmentLogs.push({
    previousQuantity: prevTotal,
    newQuantity: targetQty,
    difference,
    reason: reason || "Manual vault reconciliation",
    adjustedBy: req.user?.id as any,
    adjustedAt: new Date(),
  });

  await inventory.save();

  // Sync back to Product model
  product.stock = targetQty;
  product.inStock = targetQty > 0;
  await product.save();

  await logAudit(req, {
    action: "INVENTORY_ADJUST",
    module: "INVENTORY",
    entityId: productId,
    entityType: "Product",
    changes: { before: { quantity: prevTotal }, after: { quantity: targetQty } },
  });

  return ApiResponse.success(res, "Stock adjusted successfully", inventory);
});

export const addStock = asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
  const { productId, quantity, reason } = req.body;

  const qty = Number(quantity);
  if (!qty || qty <= 0) {
    throw ApiError.badRequest("Quantity added must be greater than 0");
  }

  const product = await Product.findById(productId);
  if (!product) {
    throw ApiError.notFound("Product not found");
  }

  let inventory = await Inventory.findOne({ product: productId });
  if (!inventory) {
    inventory = new Inventory({
      product: product._id,
      sku: product.sku,
      totalQuantity: 0,
      reservedQuantity: 0,
      availableQuantity: 0,
      adjustmentLogs: [],
    });
  }

  const prevTotal = inventory.totalQuantity;
  const newTotal = prevTotal + qty;

  inventory.totalQuantity = newTotal;
  inventory.availableQuantity = Math.max(0, newTotal - (inventory.reservedQuantity || 0));

  inventory.adjustmentLogs.push({
    previousQuantity: prevTotal,
    newQuantity: newTotal,
    difference: qty,
    reason: reason || "Stock procurement arrival",
    adjustedBy: req.user?.id as any,
    adjustedAt: new Date(),
  });

  await inventory.save();

  product.stock = newTotal;
  product.inStock = newTotal > 0;
  await product.save();

  await logAudit(req, {
    action: "INVENTORY_ADD",
    module: "INVENTORY",
    entityId: productId,
    entityType: "Product",
    changes: { before: { stock: prevTotal }, after: { stock: newTotal } },
  });

  return ApiResponse.success(res, "Stock added successfully", inventory);
});

export const removeStock = asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
  const { productId, quantity, reason } = req.body;

  const qty = Number(quantity);
  if (!qty || qty <= 0) {
    throw ApiError.badRequest("Quantity removed must be greater than 0");
  }

  const product = await Product.findById(productId);
  if (!product) {
    throw ApiError.notFound("Product not found");
  }

  let inventory = await Inventory.findOne({ product: productId });
  if (!inventory) {
    throw ApiError.badRequest("Inventory record does not exist for this product");
  }

  if (inventory.availableQuantity < qty) {
    throw ApiError.badRequest(
      `Cannot remove ${qty} units. Only ${inventory.availableQuantity} available in vault.`
    );
  }

  const prevTotal = inventory.totalQuantity;
  const newTotal = prevTotal - qty;

  inventory.totalQuantity = newTotal;
  inventory.availableQuantity = Math.max(0, newTotal - (inventory.reservedQuantity || 0));

  inventory.adjustmentLogs.push({
    previousQuantity: prevTotal,
    newQuantity: newTotal,
    difference: -qty,
    reason: reason || "Stock depletion / audit write-off",
    adjustedBy: req.user?.id as any,
    adjustedAt: new Date(),
  });

  await inventory.save();

  product.stock = newTotal;
  product.inStock = newTotal > 0;
  await product.save();

  await logAudit(req, {
    action: "INVENTORY_REMOVE",
    module: "INVENTORY",
    entityId: productId,
    entityType: "Product",
    changes: { before: { stock: prevTotal }, after: { stock: newTotal } },
  });

  return ApiResponse.success(res, "Stock removed successfully", inventory);
});

export const getInventoryHistory = asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
  const { productId } = req.params;

  const inventory = await Inventory.findOne({ product: productId })
    .populate("product", "name sku")
    .populate("adjustmentLogs.adjustedBy", "name email");

  if (!inventory) {
    throw ApiError.notFound("Inventory record not found");
  }

  return ApiResponse.success(
    res,
    "Inventory adjustment history retrieved successfully",
    inventory.adjustmentLogs.reverse()
  );
});
