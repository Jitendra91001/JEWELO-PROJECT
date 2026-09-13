import { z } from "zod";

export const createCategoryValidator = z.object({
  name: z.string().min(2, "Category name must be at least 2 characters"),
  slug: z.string().optional(),
  description: z.string().optional(),
  image: z.string().optional(),
  bannerImage: z.string().optional(),
  parentCategory: z.string().optional().nullable(),
  level: z.coerce.number().optional().default(1),
  sortOrder: z.coerce.number().optional().default(0),
  isActive: z.boolean().optional().default(true),
});

export const updateCategoryValidator = createCategoryValidator.partial();
