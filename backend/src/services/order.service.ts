import prisma from "../database/db";
import { NotFoundError, ConflictError } from "../utils/errors";
import {
  CreateOrderInput,
  UpdateOrderStatusInput,
  UpdatePaymentStatusInput,
  FilterOrderInput,
} from "../schemas/order.schema";
import { Prisma } from "@prisma/client";
import { sendOrderConfirmationEmail } from "./email.service";
import { createInvoiceForOrder } from "./invoice.service";

const generateOrderNumber = (): string => {
  const timestamp = Date.now();
  const random = Math.floor(Math.random() * 10000);
  return `ORD-${timestamp}-${random}`;
};

export const createOrder = async (userId: string, data: CreateOrderInput) => {
  // Validate products and calculate total
  const products = await prisma.product.findMany({
    where: {
      id: {
        in: data.items.map((item) => item.productId),
      },
    },
  });

  if (products.length !== data.items.length) {
    throw new NotFoundError("One or more products not found");
  }

  // Calculate subtotal
  let subtotal = 0;
  const orderItems = data.items.map((item) => {
    const product = products.find((p) => p.id === item.productId);
    if (!product) throw new NotFoundError("Product not found");

    const price = product.discountPrice || product.price;
    subtotal += price * item.quantity;

    return {
      productId: item.productId,
      quantity: item.quantity,
      price,
    };
  });

  // Apply coupon if provided
  let discountAmount = 0;
  if (data.couponCode) {
    const coupon = await prisma.coupon.findUnique({
      where: { code: data.couponCode },
    });

    if (coupon && coupon.isActive) {
      if (subtotal >= coupon.minPurchase) {
        if (coupon.discountType === "PERCENTAGE") {
          discountAmount = (subtotal * coupon.discountValue) / 100;
        } else {
          discountAmount = coupon.discountValue;
        }

        if (coupon.maxDiscount) {
          discountAmount = Math.min(discountAmount, coupon.maxDiscount);
        }
      }
    }
  }

  const tax = subtotal * 0.1;
  const shippingCost = subtotal > 100 ? 0 : 10;
  const total = subtotal + tax + shippingCost - discountAmount;

  const orderNumber = generateOrderNumber();

  const order = await prisma.order.create({
    data: {
      orderNumber,
      userId,
      shippingAddress: data.shippingAddress,
      billingAddress: data.billingAddress || data.shippingAddress,
      subtotal,
      tax,
      shippingCost,
      discountAmount,
      total,
      couponCode: data.couponCode,
      paymentMethod: data.paymentMethod,
      notes: data.notes,
      items: {
        create: orderItems,
      },
    },
    include: {
      items: true,
      user: {
        select: {
          id: true,
          name: true,
          email: true,
          role: true,
          createdAt: true,
        },
      },
    },
  });
  await createInvoiceForOrder(order);

  // Update coupon usage if applied
  if (data.couponCode) {
    await prisma.coupon.update({
      where: { code: data.couponCode },
      data: {
        usageCount: { increment: 1 },
        usedBy: { push: userId },
      },
    });
  }

  // Send order confirmation email
  try {
    await sendOrderConfirmationEmail(order.user.email, orderNumber, total);
  } catch (error) {
    console.error("Failed to send order confirmation email:", error);
  }

  return order;
};

export const getOrderById = async (id: string) => {
  const order = await prisma.order.findUnique({
    where: { id },
    include: {
      items: {
        include: { product: true },
      },
      user: {
        select: {
          id: true,
          name: true,
          email: true,
          role: true,
          createdAt: true,
        },
      },
    },
  });

  if (!order) {
    throw new NotFoundError("Order not found");
  }

  return order;
};

export const getUserOrders = async (
  userId: string,
  filters: FilterOrderInput,
) => {
  const {
    status,
    paymentStatus,
    page = 1,
    limit = 10,
    sortBy = "createdAt",
    sortOrder = "desc",
  } = filters;

  const skip = (page - 1) * limit;

  const where: Prisma.OrderWhereInput = {
    userId,
    ...(status && { status }),
    ...(paymentStatus && { paymentStatus }),
  };

  const orderBy: Prisma.OrderOrderByWithRelationInput = {};
  if (sortBy === "total") {
    orderBy.total = sortOrder as any;
  } else {
    orderBy.createdAt = sortOrder as any;
  }

  const [orders, total] = await Promise.all([
    prisma.order.findMany({
      where,
      include: {
        items: { include: { product: true } },
      },
      orderBy,
      skip,
      take: limit,
    }),
    prisma.order.count({ where }),
  ]);

  return { orders, total, page, limit };
};

export const getAllOrders = async (filters: FilterOrderInput) => {
  const {
    status,
    paymentStatus,
    startDate,
    endDate,
    minAmount,
    maxAmount,
    page = 1,
    limit = 10,
    sortBy = "createdAt",
    sortOrder = "desc",
  } = filters;

  const skip = (page - 1) * limit;

  const where: Prisma.OrderWhereInput = {
    ...(status && { status }),
    ...(paymentStatus && { paymentStatus }),
    ...((startDate || endDate) && {
      createdAt: {
        ...(startDate && { gte: new Date(startDate) }),
        ...(endDate && { lte: new Date(endDate) }),
      },
    }),
    ...((minAmount !== undefined || maxAmount !== undefined) && {
      total: {
        ...(minAmount !== undefined && { gte: minAmount }),
        ...(maxAmount !== undefined && { lte: maxAmount }),
      },
    }),
  };

  const orderBy: Prisma.OrderOrderByWithRelationInput = {};
  if (sortBy === "total") {
    orderBy.total = sortOrder as any;
  } else {
    orderBy.createdAt = sortOrder as any;
  }

  const [orders, total] = await Promise.all([
    prisma.order.findMany({
      where,
      include: {
        items: { include: { product: true } },
        user: true,
      },
      orderBy,
      skip,
      take: limit,
    }),
    prisma.order.count({ where }),
  ]);

  return { orders, total, page, limit };
};

export const updateOrderStatus = async (
  id: string,
  data: UpdateOrderStatusInput,
) => {
  const order = await prisma.order.findUnique({ where: { id } });

  if (!order) {
    throw new NotFoundError("Order not found");
  }

  return prisma.order.update({
    where: { id },
    data: { status: data.status },
  });
};

export const updatePaymentStatus = async (
  id: string,
  data: UpdatePaymentStatusInput,
) => {
  const order = await prisma.order.findUnique({ where: { id } });

  if (!order) {
    throw new NotFoundError("Order not found");
  }

  return prisma.order.update({
    where: { id },
    data: {
      paymentStatus: data.paymentStatus,
      transactionId: data.transactionId,
    },
  });
};
