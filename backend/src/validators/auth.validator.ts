import { z } from "zod";

export const loginValidator = z.object({
  email: z.string().email("Please provide a valid email address"),
  password: z.string().min(6, "Password must be at least 6 characters long"),
});

export const registerValidator = z.object({
  name: z.string().min(2, "Full name must be at least 2 characters long"),
  email: z.string().email("Please provide a valid email address"),
  password: z
    .string()
    .min(6, "Password must be at least 6 characters long")
    .max(100, "Password cannot exceed 100 characters"),
  phone: z
    .string()
    .regex(/^\+?[0-9\s-]{8,15}$/, "Please provide a valid phone number")
    .optional(),
});

export const updateProfileValidator = z.object({
  name: z.string().min(2, "Name must be at least 2 characters").optional(),
  email: z.string().email("Valid email required").optional(),
  phone: z.string().optional(),
  avatarUrl: z.string().optional(),
});

export const forgotPasswordValidator = z.object({
  email: z.string().email("Valid email required"),
});

export const resetPasswordValidator = z.object({
  token: z.string().min(1, "Reset token is required"),
  password: z.string().min(6, "Password must be at least 6 characters long"),
  confirmPassword: z.string().min(6, "Password confirmation required"),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords do not match",
  path: ["confirmPassword"],
});
