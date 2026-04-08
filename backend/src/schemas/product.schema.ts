import { z } from "zod";

export const createProductSchema = z.object({
  name: z.string().min(3, "Product name is required"),
  slug: z.string().min(3, "Slug is required"),
  description: z.string().optional(),
  price: z.coerce.number().positive("Price must be greater than 0"),
  discountPrice: z.coerce.number().positive().optional(),
  cost: z.coerce.number().positive().optional(),

  categoryId: z.string().min(1, "Category is required"),
  sku: z.string().min(1, "SKU is required"),

  quantity: z.coerce.number().int().nonnegative().optional(),

  thumbnail: z.string().url().optional(),
  material: z.string().optional(),

  weight: z.coerce.number().positive().optional(),
  isActive: z.coerce.boolean().default(true),
  isFeatured: z.coerce.boolean().default(false),
});

export const updateProductSchema = createProductSchema.partial();

export const filterProductSchema = z.object({
  search: z.string().optional(),
  categoryId: z.string().optional(),
  minPrice: z.coerce.number().optional(),
  maxPrice: z.coerce.number().optional(),
  isFeatured: z.coerce.boolean().optional(),
  material: z.string().optional(),
  page: z.coerce.number().int().positive().optional(),
  limit: z.coerce.number().int().positive().optional(),
  sortBy: z.enum(["price", "name", "rating", "createdAt"]).optional(),
  sortOrder: z.enum(["asc", "desc"]).optional(),
  createdAt: z
    .union([
      z
        .string()
        .refine((val) => !isNaN(Date.parse(val)), { message: "Invalid Date" }),
      z.date(),
    ])
    .optional(),
});

export type CreateProductInput = z.infer<typeof createProductSchema>;
export type UpdateProductInput = z.infer<typeof updateProductSchema>;
export type FilterProductInput = z.infer<typeof filterProductSchema>;
