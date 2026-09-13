import { z } from "zod";

export const addToCartValidator = z.object({
  productId: z.string().min(1, "Product ID is required"),
  quantity: z.coerce.number().int().min(1, "Quantity must be at least 1").default(1),
  variantId: z.string().optional(),
  selectedSize: z.string().optional(),
  metalPurity: z.string().optional(),
  engravingText: z.string().max(50).optional(),
});

export const updateCartQuantityValidator = z.object({
  quantity: z.coerce.number().int().min(0, "Quantity cannot be negative"),
});
