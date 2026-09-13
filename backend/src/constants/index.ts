/**
 * Production Constants and Enums for Jewellery E-Commerce
 */

export const HTTP_STATUS = {
  OK: 200,
  CREATED: 201,
  ACCEPTED: 202,
  NO_CONTENT: 204,
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  CONFLICT: 409,
  UNPROCESSABLE_ENTITY: 422,
  TOO_MANY_REQUESTS: 429,
  INTERNAL_SERVER_ERROR: 500,
  SERVICE_UNAVAILABLE: 503,
} as const;

export * from "./permissions";

export const USER_ROLES = {
  SUPER_ADMIN: "SUPER_ADMIN",
  ADMIN: "ADMIN",
  MANAGER: "MANAGER",
  STAFF: "STAFF",
  CUSTOMER: "CUSTOMER",
  USER: "CUSTOMER",
} as const;

export type UserRoleType = (typeof USER_ROLES)[keyof typeof USER_ROLES];

// Jewellery Metal Types & Purities
export const METAL_TYPES = {
  YELLOW_GOLD: "YELLOW_GOLD",
  WHITE_GOLD: "WHITE_GOLD",
  ROSE_GOLD: "ROSE_GOLD",
  PLATINUM: "PLATINUM",
  STERLING_SILVER: "STERLING_SILVER",
} as const;

export const METAL_PURITIES = {
  GOLD_24K: "24K",
  GOLD_22K: "22K",
  GOLD_18K: "18K",
  GOLD_14K: "14K",
  GOLD_10K: "10K",
  PLATINUM_950: "PT950",
  SILVER_925: "925",
} as const;

// Gemstones & Diamond Grading
export const GEMSTONE_TYPES = {
  DIAMOND: "DIAMOND",
  EMERALD: "EMERALD",
  RUBY: "RUBY",
  SAPPHIRE: "SAPPHIRE",
  PEARL: "PEARL",
  TANZANITE: "TANZANITE",
  OPAL: "OPAL",
  NONE: "NONE",
} as const;

export const DIAMOND_CUTS = {
  EXCELLENT: "EXCELLENT",
  VERY_GOOD: "VERY_GOOD",
  GOOD: "GOOD",
  FAIR: "FAIR",
} as const;

export const DIAMOND_CLARITIES = {
  FL: "FL",     // Flawless
  IF: "IF",     // Internally Flawless
  VVS1: "VVS1", // Very, Very Slightly Included 1
  VVS2: "VVS2",
  VS1: "VS1",   // Very Slightly Included 1
  VS2: "VS2",
  SI1: "SI1",   // Slightly Included 1
  SI2: "SI2",
  I1: "I1",     // Included 1
} as const;

export const DIAMOND_COLORS = {
  D: "D", E: "E", F: "F", // Colorless
  G: "G", H: "H", I: "I", J: "J", // Near Colorless
  K: "K", L: "L", M: "M", // Faint
} as const;

export const CERTIFICATION_AGENCIES = {
  GIA: "GIA",
  IGI: "IGI",
  SGL: "SGL",
  BIS_HALLMARK: "BIS_HALLMARK",
  HRD: "HRD",
  IN_HOUSE: "IN_HOUSE",
} as const;

// Orders & Payments
export const ORDER_STATUS = {
  PENDING: "PENDING",
  CONFIRMED: "CONFIRMED",
  PROCESSING: "PROCESSING",
  IN_PRODUCTION: "IN_PRODUCTION",
  SHIPPED: "SHIPPED",
  OUT_FOR_DELIVERY: "OUT_FOR_DELIVERY",
  DELIVERED: "DELIVERED",
  CANCELLED: "CANCELLED",
  RETURN_REQUESTED: "RETURN_REQUESTED",
  RETURNED: "RETURNED",
} as const;

export const PAYMENT_STATUS = {
  PENDING: "PENDING",
  AUTHORIZED: "AUTHORIZED",
  COMPLETED: "COMPLETED",
  FAILED: "FAILED",
  REFUNDED: "REFUNDED",
  PARTIALLY_REFUNDED: "PARTIALLY_REFUNDED",
} as const;

export const PAYMENT_METHODS = {
  CREDIT_CARD: "CREDIT_CARD",
  DEBIT_CARD: "DEBIT_CARD",
  NET_BANKING: "NET_BANKING",
  UPI: "UPI",
  WALLET: "WALLET",
  RAZORPAY: "RAZORPAY",
  STRIPE: "STRIPE",
  CASH_ON_DELIVERY: "COD",
} as const;

export const INVENTORY_STATUS = {
  IN_STOCK: "IN_STOCK",
  LOW_STOCK: "LOW_STOCK",
  OUT_OF_STOCK: "OUT_OF_STOCK",
  DISCONTINUED: "DISCONTINUED",
} as const;

export const REVIEW_STATUS = {
  PENDING: "PENDING",
  APPROVED: "APPROVED",
  REJECTED: "REJECTED",
  HIDDEN: "HIDDEN",
} as const;

export const RETURN_STATUS = {
  REQUESTED: "REQUESTED",
  PENDING: "PENDING",
  APPROVED: "APPROVED",
  REJECTED: "REJECTED",
  RECEIVED: "RECEIVED",
  ITEM_RECEIVED: "ITEM_RECEIVED",
  INSPECTED: "INSPECTED",
  REFUNDED: "REFUNDED",
  CANCELLED: "CANCELLED",
} as const;
