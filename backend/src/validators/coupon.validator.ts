import { z } from "zod";
import { COUPON_DISCOUNT_TYPES } from "../models/Coupon.model";

export const createCouponValidator = z.object({
  code: z.string().min(3, "Coupon code must be at least 3 characters").toUpperCase(),
  description: z.string().optional(),
  discountType: z.enum([COUPON_DISCOUNT_TYPES.PERCENTAGE, COUPON_DISCOUNT_TYPES.FLAT]),
  discountValue: z.coerce.number().positive("Discount value must be greater than 0"),
  minOrderValue: z.coerce.number().min(0).default(0),
  maxDiscountAmount: z.coerce.number().positive().optional().nullable(),
  startDate: z.coerce.date().default(() => new Date()),
  endDate: z.coerce.date(),
  usageLimit: z.coerce.number().positive().optional().nullable(),
  userUsageLimit: z.coerce.number().positive().default(1),
  isActive: z.boolean().default(true),
});

export const updateCouponValidator = createCouponValidator.partial();
