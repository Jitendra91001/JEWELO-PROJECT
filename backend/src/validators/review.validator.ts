import { z } from "zod";

export const createReviewValidator = z.object({
  productId: z.string().min(1, "Product ID is required"),
  orderId: z.string().optional(),
  rating: z.coerce.number().min(1).max(5),
  title: z.string().optional(),
  comment: z.string().min(3, "Review comment must be at least 3 characters"),
  images: z.array(z.string()).optional().default([]),
});

export const createFeedbackValidator = z.object({
  name: z.string().min(2, "Name is required"),
  rating: z.coerce.number().min(1).max(5),
  descriptionText: z.string().min(3, "Description is required"),
});
