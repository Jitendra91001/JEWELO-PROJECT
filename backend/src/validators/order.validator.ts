import { z } from "zod";

export const orderItemInputValidator = z.object({
  productId: z.string().min(1, "Product ID is required"),
  quantity: z.coerce.number().int().min(1, "Quantity must be at least 1"),
  variantId: z.string().optional(),
  selectedSize: z.string().optional(),
  metalPurity: z.string().optional(),
  engravingText: z.string().max(50).optional(),
});

export const createOrderValidator = z.object({
  items: z.array(orderItemInputValidator).min(1, "At least one item is required to place an order"),
  shippingAddress: z.union([
    z.string().min(1, "Shipping address ID or text is required"),
    z.object({
      fullName: z.string().min(2),
      phone: z.string().min(8),
      addressLine1: z.string().min(5),
      addressLine2: z.string().optional(),
      landmark: z.string().optional(),
      city: z.string().min(2),
      state: z.string().min(2),
      postalCode: z.string().min(4),
      country: z.string().default("India"),
    }),
  ]),
  billingAddress: z
    .union([
      z.string(),
      z.object({
        fullName: z.string().min(2),
        phone: z.string().min(8),
        addressLine1: z.string().min(5),
        addressLine2: z.string().optional(),
        landmark: z.string().optional(),
        city: z.string().min(2),
        state: z.string().min(2),
        postalCode: z.string().min(4),
        country: z.string().default("India"),
      }),
    ])
    .optional(),
  paymentMethod: z.enum(["COD", "UPI", "RAZORPAY", "STRIPE", "CREDIT_CARD", "DEBIT_CARD", "NET_BANKING"]).default("COD"),
  couponCode: z.string().optional(),
  notes: z.string().optional(),
  isGift: z.boolean().optional().default(false),
  giftMessage: z.string().optional(),
});

export const updateOrderStatusValidator = z.object({
  status: z.string().min(1, "Status is required"),
  trackingNumber: z.string().optional(),
  courierPartner: z.string().optional(),
});
