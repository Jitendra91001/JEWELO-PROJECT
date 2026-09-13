import { Response } from "express";
import { asyncHandler } from "../utils/asyncHandler";
import { ApiResponse } from "../utils/ApiResponse";
import { ApiError } from "../utils/ApiError";
import { Cart, Product, Coupon } from "../models";
import { AuthenticatedRequest } from "../types";

// Server-side recalculation helper
const recalculateCartTotals = async (cart: any) => {
  let subtotal = 0;

  for (const item of cart.items) {
    const product = await Product.findById(item.product);
    if (product) {
      item.price = product.price; // Always force database truth
      subtotal += item.price * item.quantity;
    }
  }

  cart.subtotal = subtotal;

  let discountAmount = 0;
  if (cart.coupon) {
    const coupon = await Coupon.findById(cart.coupon);
    if (coupon && coupon.isActive && !coupon.isDeleted && subtotal >= coupon.minOrderValue) {
      if (coupon.discountType === "PERCENTAGE") {
        discountAmount = Math.round((subtotal * coupon.discountValue) / 100);
        if (coupon.maxDiscountAmount && discountAmount > coupon.maxDiscountAmount) {
          discountAmount = coupon.maxDiscountAmount;
        }
      } else {
        discountAmount = Math.min(coupon.discountValue, subtotal);
      }
    } else {
      cart.coupon = null;
      cart.couponCode = undefined;
    }
  }

  cart.discountAmount = discountAmount;
  cart.taxAmount = Math.round((subtotal - discountAmount) * 0.03); // 3% GST
  cart.totalAmount = Math.max(0, subtotal - discountAmount + cart.taxAmount);
};

export const getCart = asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
  if (!req.user) throw ApiError.unauthorized("Authentication required");

  let cart = await Cart.findOne({ user: req.user.id })
    .populate("items.product", "name slug price comparePrice thumbnail images inStock stock metalType metalPurity")
    .populate("items.variant");

  if (!cart) {
    cart = await Cart.create({
      user: req.user.id,
      items: [],
      subtotal: 0,
      discountAmount: 0,
      taxAmount: 0,
      totalAmount: 0,
    });
  } else {
    // Recalculate to ensure prices match current database catalog
    await recalculateCartTotals(cart);
    await cart.save();
  }

  return ApiResponse.success(res, "Cart retrieved successfully", cart);
});

export const addCartItem = asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
  if (!req.user) throw ApiError.unauthorized("Authentication required");

  const { productId, quantity = 1, variantId, selectedSize, metalPurity, engravingText } = req.body;

  const product = await Product.findOne({ _id: productId, isDeleted: false });
  if (!product) {
    throw ApiError.notFound("Product not found");
  }

  const requestedQty = Number(quantity);
  if (requestedQty <= 0) {
    throw ApiError.badRequest("Quantity must be greater than 0");
  }

  if (product.stock < requestedQty) {
    throw ApiError.badRequest(`Insufficient stock for "${product.name}". Available: ${product.stock}`);
  }

  let cart = await Cart.findOne({ user: req.user.id });
  if (!cart) {
    cart = new Cart({ user: req.user.id, items: [] });
  }

  const existingIndex = cart.items.findIndex(
    (item) =>
      item.product.toString() === productId &&
      (!variantId || item.variant?.toString() === variantId) &&
      (!selectedSize || item.selectedSize === selectedSize)
  );

  if (existingIndex > -1) {
    const newQty = cart.items[existingIndex].quantity + requestedQty;
    if (product.stock < newQty) {
      throw ApiError.badRequest(`Cannot add ${requestedQty} more. Exceeds available stock (${product.stock})`);
    }
    cart.items[existingIndex].quantity = newQty;
    cart.items[existingIndex].price = product.price;
  } else {
    cart.items.push({
      product: product._id,
      variant: variantId || null,
      quantity: requestedQty,
      price: product.price,
      selectedSize,
      metalPurity: metalPurity || product.metalPurity,
      engravingText,
      addedAt: new Date(),
    });
  }

  await recalculateCartTotals(cart);
  await cart.save();
  await cart.populate("items.product", "name slug price comparePrice thumbnail images inStock stock");

  return ApiResponse.success(res, "Item added to cart", cart);
});

export const updateCartItem = asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
  if (!req.user) throw ApiError.unauthorized("Authentication required");

  const itemId = req.params.itemId || req.params.productId;
  const { quantity } = req.body;

  const qty = Number(quantity);
  const cart = await Cart.findOne({ user: req.user.id });
  if (!cart) throw ApiError.notFound("Cart not found");

  const itemIndex = cart.items.findIndex(
    (i: any) => i._id?.toString() === itemId || i.product?.toString() === itemId
  );

  if (itemIndex === -1) {
    throw ApiError.notFound("Item not found in cart");
  }

  if (qty <= 0) {
    cart.items.splice(itemIndex, 1);
  } else {
    const product = await Product.findById(cart.items[itemIndex].product);
    if (product && product.stock < qty) {
      throw ApiError.badRequest(`Requested quantity exceeds available stock (${product.stock})`);
    }
    cart.items[itemIndex].quantity = qty;
  }

  await recalculateCartTotals(cart);
  await cart.save();
  await cart.populate("items.product", "name slug price comparePrice thumbnail images inStock stock");

  return ApiResponse.success(res, "Cart updated successfully", cart);
});

export const removeCartItem = asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
  if (!req.user) throw ApiError.unauthorized("Authentication required");

  const itemId = req.params.itemId || req.params.productId;
  const cart = await Cart.findOne({ user: req.user.id });
  if (!cart) throw ApiError.notFound("Cart not found");

  cart.items = cart.items.filter(
    (i: any) => i._id?.toString() !== itemId && i.product?.toString() !== itemId
  );

  await recalculateCartTotals(cart);
  await cart.save();
  await cart.populate("items.product", "name slug price comparePrice thumbnail images inStock stock");

  return ApiResponse.success(res, "Item removed from cart", cart);
});

export const clearCart = asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
  if (!req.user) throw ApiError.unauthorized("Authentication required");

  const cart = await Cart.findOne({ user: req.user.id });
  if (cart) {
    cart.items = [];
    cart.coupon = null;
    cart.couponCode = undefined;
    cart.subtotal = 0;
    cart.discountAmount = 0;
    cart.taxAmount = 0;
    cart.totalAmount = 0;
    await cart.save();
  }

  return ApiResponse.success(res, "Cart cleared successfully", { items: [], totalAmount: 0 });
});

export const applyCoupon = asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
  if (!req.user) throw ApiError.unauthorized("Authentication required");

  const { couponCode } = req.body;
  if (!couponCode) throw ApiError.badRequest("Coupon code is required");

  const cart = await Cart.findOne({ user: req.user.id });
  if (!cart || cart.items.length === 0) {
    throw ApiError.badRequest("Cart is empty");
  }

  const coupon = await Coupon.findOne({
    code: couponCode.toUpperCase().trim(),
    isActive: true,
    isDeleted: false,
    startDate: { $lte: new Date() },
    endDate: { $gte: new Date() },
  });

  if (!coupon) {
    throw ApiError.badRequest("Invalid or expired coupon code");
  }

  if (cart.subtotal < coupon.minOrderValue) {
    throw ApiError.badRequest(`Minimum order value of ₹${coupon.minOrderValue} required for this coupon`);
  }

  cart.coupon = coupon._id;
  cart.couponCode = coupon.code;
  await recalculateCartTotals(cart);
  await cart.save();

  return ApiResponse.success(res, "Coupon applied successfully", cart);
});

export const removeCoupon = asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
  if (!req.user) throw ApiError.unauthorized("Authentication required");

  const cart = await Cart.findOne({ user: req.user.id });
  if (!cart) throw ApiError.notFound("Cart not found");

  cart.coupon = null;
  cart.couponCode = undefined;
  await recalculateCartTotals(cart);
  await cart.save();

  return ApiResponse.success(res, "Coupon removed successfully", cart);
});
