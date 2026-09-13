import { z } from "zod";
import { METAL_TYPES, METAL_PURITIES } from "../constants";

export const createProductValidator = z.object({
  name: z.string().min(3, "Product name must be at least 3 characters"),
  slug: z.string().optional(),
  description: z.string().min(10, "Description must be at least 10 characters"),
  category: z.string().min(1, "Category ID is required"),
  collectionId: z.string().optional().nullable(),
  sku: z.string().min(2, "SKU is required"),
  price: z.coerce.number().positive("Price must be greater than 0"),
  comparePrice: z.coerce.number().optional(),
  costPrice: z.coerce.number().optional(),
  metalType: z.string().default(METAL_TYPES.YELLOW_GOLD),
  metalPurity: z.string().default(METAL_PURITIES.GOLD_18K),
  metalWeight: z.coerce.number().positive("Metal weight must be greater than 0").default(1),
  stock: z.coerce.number().min(0, "Stock cannot be negative").default(0),
  images: z.array(z.string()).optional(),
  thumbnail: z.string().optional(),
  isFeatured: z.coerce.boolean().optional().default(false),
  isBestseller: z.coerce.boolean().optional().default(false),
  isNewArrival: z.coerce.boolean().optional().default(false),
  status: z.enum(["DRAFT", "PUBLISHED", "ARCHIVED"]).optional().default("PUBLISHED"),
  tags: z.array(z.string()).optional(),
});

export const updateProductValidator = createProductValidator.partial().extend({
  isActive: z.boolean().optional(),
});

export const productFilterValidator = z.object({
  category: z.string().optional(),
  material: z.string().optional(),
  metalType: z.string().optional(),
  metalPurity: z.string().optional(),
  minPrice: z.coerce.number().optional(),
  maxPrice: z.coerce.number().optional(),
  gender: z.string().optional(),
  occasion: z.string().optional(),
  sort: z.string().optional(),
  page: z.coerce.number().min(1).default(1),
  size: z.coerce.number().min(1).max(100).default(12),
  search: z.string().optional(),
  q: z.string().optional(),
});
