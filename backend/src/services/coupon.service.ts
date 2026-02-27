import prisma from '../database/db';
import { NotFoundError, ConflictError } from '../utils/errors';

export interface CreateCouponInput {
  code: string;
  description?: string;
  discountType: 'PERCENTAGE' | 'FIXED';
  discountValue: number;
  minPurchase?: number;
  maxDiscount?: number;
  usageLimit?: number;
  validFrom: Date;
  validUpto: Date;
}

export interface UpdateCouponInput {
  description?: string;
  discountValue?: number;
  minPurchase?: number;
  maxDiscount?: number;
  usageLimit?: number;
  validUpto?: Date;
  isActive?: boolean;
}

export const createCoupon = async (data: CreateCouponInput) => {
  // Check if code exists
  const existing = await prisma.coupon.findUnique({
    where: { code: data.code },
  });

  if (existing) {
    throw new ConflictError('Coupon with this code already exists');
  }

  return prisma.coupon.create({
    data: {
      code: data.code,
      description: data.description,
      discountType: data.discountType,
      discountValue: data.discountValue,
      minPurchase: data.minPurchase || 0,
      maxDiscount: data.maxDiscount,
      usageLimit: data.usageLimit,
      validFrom: data.validFrom,
      validUpto: data.validUpto,
    },
  });
};

export const getCouponByCode = async (code: string) => {
  const coupon = await prisma.coupon.findUnique({
    where: { code },
  });

  if (!coupon) {
    throw new NotFoundError('Coupon not found');
  }

  return coupon;
};

export const validateCoupon = async (code: string, orderTotal: number) => {
  const coupon = await prisma.coupon.findUnique({
    where: { code },
  });

  if (!coupon) {
    throw new NotFoundError('Coupon not found');
  }

  if (!coupon.isActive) {
    throw new Error('Coupon is not active');
  }

  if (new Date() < coupon.validFrom || new Date() > coupon.validUpto) {
    throw new Error('Coupon is expired');
  }

  if (coupon.usageLimit && coupon.usageCount >= coupon.usageLimit) {
    throw new Error('Coupon usage limit exceeded');
  }

  if (orderTotal < coupon.minPurchase) {
    throw new Error(
      `Minimum purchase of $${coupon.minPurchase} required for this coupon`
    );
  }

  // Calculate discount
  let discountAmount = 0;
  if (coupon.discountType === 'PERCENTAGE') {
    discountAmount = (orderTotal * coupon.discountValue) / 100;
  } else {
    discountAmount = coupon.discountValue;
  }

  if (coupon.maxDiscount) {
    discountAmount = Math.min(discountAmount, coupon.maxDiscount);
  }

  return {
    coupon,
    discountAmount,
  };
};

export const getAllCoupons = async (onlyActive: boolean = false) => {
  const where = onlyActive ? { isActive: true } : {};

  return prisma.coupon.findMany({
    where,
    orderBy: { createdAt: 'desc' },
  });
};

export const updateCoupon = async (id: string, data: UpdateCouponInput) => {
  const coupon = await prisma.coupon.findUnique({ where: { id } });

  if (!coupon) {
    throw new NotFoundError('Coupon not found');
  }

  return prisma.coupon.update({
    where: { id },
    data,
  });
};

export const deleteCoupon = async (id: string) => {
  const coupon = await prisma.coupon.findUnique({ where: { id } });

  if (!coupon) {
    throw new NotFoundError('Coupon not found');
  }

  return prisma.coupon.delete({ where: { id } });
};
