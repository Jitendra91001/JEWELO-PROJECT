import { Types } from "mongoose";
import { Product, Inventory } from "../models";
import { ApiError } from "../utils/ApiError";
import { INVENTORY_STATUS } from "../constants";

export interface StockChangeItem {
  productId: string | Types.ObjectId;
  variantId?: string | Types.ObjectId | null;
  quantity: number;
}

export const reserveStockForOrder = async (
  _orderId: string | Types.ObjectId,
  items: StockChangeItem[],
  performedBy?: string | Types.ObjectId
): Promise<void> => {
  for (const item of items) {
    // 1. Atomically verify available stock and deduct from Product
    const updatedProduct = await Product.findOneAndUpdate(
      { _id: item.productId, stock: { $gte: item.quantity }, isDeleted: false },
      { $inc: { stock: -item.quantity } },
      { new: true }
    );

    if (!updatedProduct) {
      throw ApiError.badRequest(
        `Insufficient stock for product ID "${item.productId}". Could not reserve ${item.quantity} units.`
      );
    }

    // 2. Reflect in Inventory document
    let inv = await Inventory.findOne({ product: item.productId });
    if (!inv) {
      inv = await Inventory.create({
        product: updatedProduct._id,
        sku: updatedProduct.sku,
        totalQuantity: updatedProduct.stock + item.quantity,
        reservedQuantity: 0,
        availableQuantity: updatedProduct.stock + item.quantity,
        safetyThreshold: updatedProduct.safetyThreshold || 5,
        status: INVENTORY_STATUS.IN_STOCK,
        adjustmentLogs: [],
      });
    }

    const prevQty = inv.totalQuantity;
    inv.reservedQuantity = (inv.reservedQuantity || 0) + item.quantity;
    inv.availableQuantity = Math.max(0, inv.totalQuantity - inv.reservedQuantity);

    inv.adjustmentLogs.push({
      previousQuantity: prevQty,
      newQuantity: inv.totalQuantity,
      difference: -item.quantity,
      reason: `Reserved for order: ${_orderId}`,
      adjustedBy: performedBy as any,
      adjustedAt: new Date(),
    });

    await inv.save();
  }
};

export const releaseStockForOrder = async (
  _orderId: string | Types.ObjectId,
  items: StockChangeItem[],
  performedBy?: string | Types.ObjectId
): Promise<void> => {
  for (const item of items) {
    // Restore stock to product
    await Product.findByIdAndUpdate(item.productId, {
      $inc: { stock: item.quantity },
      $set: { inStock: true },
    });

    const inv = await Inventory.findOne({ product: item.productId });
    if (inv) {
      const prevQty = inv.totalQuantity;
      inv.reservedQuantity = Math.max(0, (inv.reservedQuantity || 0) - item.quantity);
      inv.availableQuantity = Math.max(0, inv.totalQuantity - inv.reservedQuantity);

      inv.adjustmentLogs.push({
        previousQuantity: prevQty,
        newQuantity: inv.totalQuantity,
        difference: item.quantity,
        reason: `Restored stock from cancelled order: ${_orderId}`,
        adjustedBy: performedBy as any,
        adjustedAt: new Date(),
      });

      await inv.save();
    }
  }
};

export const commitSoldStockForOrder = async (
  _orderId: string | Types.ObjectId,
  items: StockChangeItem[],
  performedBy?: string | Types.ObjectId
): Promise<void> => {
  for (const item of items) {
    const inv = await Inventory.findOne({ product: item.productId });
    if (inv) {
      const prevQty = inv.totalQuantity;
      inv.reservedQuantity = Math.max(0, (inv.reservedQuantity || 0) - item.quantity);
      inv.totalQuantity = Math.max(0, inv.totalQuantity - item.quantity);
      inv.soldQuantity = (inv.soldQuantity || 0) + item.quantity;
      inv.availableQuantity = Math.max(0, inv.totalQuantity - inv.reservedQuantity);

      inv.adjustmentLogs.push({
        previousQuantity: prevQty,
        newQuantity: inv.totalQuantity,
        difference: -item.quantity,
        reason: `Fulfilled order delivery: ${_orderId}`,
        adjustedBy: performedBy as any,
        adjustedAt: new Date(),
      });

      await inv.save();
    }
  }
};
