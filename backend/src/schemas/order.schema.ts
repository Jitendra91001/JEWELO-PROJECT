import { z } from 'zod';

export const createOrderSchema = z.object({
  items: z.array(
    z.object({
      productId: z.string().min(1, 'Product ID is required'),
      quantity: z.number().int().positive('Quantity must be at least 1'),
    })
  ).min(1, 'At least one item is required'),
  shippingAddress: z.string().min(1, 'Shipping address is required'),
  billingAddress: z.string().optional(),
  couponCode: z.string().optional(),
  paymentMethod: z.string().min(1, 'Payment method is required'),
  notes: z.string().optional(),
});

export const updateOrderStatusSchema = z.object({
  status: z.enum(['PENDING', 'CONFIRMED', 'SHIPPED', 'DELIVERED', 'CANCELLED']),
});

export const updatePaymentStatusSchema = z.object({
  paymentStatus: z.enum(['PENDING', 'COMPLETED', 'FAILED', 'REFUNDED']),
  transactionId: z.string().optional(),
});

export const filterOrderSchema = z.object({
  status: z.enum(['PENDING', 'CONFIRMED', 'SHIPPED', 'DELIVERED', 'CANCELLED']).optional(),
  paymentStatus: z.enum(['PENDING', 'COMPLETED', 'FAILED', 'REFUNDED']).optional(),
  startDate: z.string().datetime().optional(),
  endDate: z.string().datetime().optional(),
  minAmount: z.coerce.number().optional(),
  maxAmount: z.coerce.number().optional(),
  page: z.coerce.number().int().positive().optional(),
  limit: z.coerce.number().int().positive().optional(),
  sortBy: z.enum(['createdAt', 'total']).optional(),
  sortOrder: z.enum(['asc', 'desc']).optional(),
});

export type CreateOrderInput = z.infer<typeof createOrderSchema>;
export type UpdateOrderStatusInput = z.infer<typeof updateOrderStatusSchema>;
export type UpdatePaymentStatusInput = z.infer<typeof updatePaymentStatusSchema>;
export type FilterOrderInput = z.infer<typeof filterOrderSchema>;
