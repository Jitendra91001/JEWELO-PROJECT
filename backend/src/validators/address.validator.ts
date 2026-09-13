import { z } from "zod";

export const addressValidator = z.object({
  name: z.string().min(2, "Name must be at least 2 characters").optional(),
  fullName: z.string().min(2, "Full name must be at least 2 characters").optional(),
  phone: z.string().min(8, "Valid phone number required"),
  alternatePhone: z.string().optional(),
  line1: z.string().min(5, "Address line 1 is required").optional(),
  addressLine1: z.string().min(5, "Address line 1 is required").optional(),
  line2: z.string().optional(),
  addressLine2: z.string().optional(),
  landmark: z.string().optional(),
  city: z.string().min(2, "City is required"),
  state: z.string().min(2, "State is required"),
  pincode: z.string().min(4, "Pincode is required").optional(),
  postalCode: z.string().min(4, "Postal code is required").optional(),
  country: z.string().default("India"),
  addressType: z.enum(["HOME", "WORK", "OTHER"]).default("HOME"),
  isDefault: z.boolean().optional(),
  isDefaultShipping: z.boolean().optional(),
  isDefaultBilling: z.boolean().optional(),
});
