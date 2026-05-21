import axiosInstance from "./axiosInstance";

export interface OrderItemPayload {
  productId: string;
  quantity: number;
}

export interface OrderPayload {
  items: OrderItemPayload[];
  shippingAddress: string;
  billingAddress?: string;
  paymentMethod: "COD" | "UPI";
  couponCode?: string;
  notes?: string;
}

export const orderAPI = {
  create: (data: OrderPayload) => axiosInstance.post("/api/v1/orders", data),
  getMyOrders: (params?: Record<string, unknown>) => axiosInstance.get("/api/v1/orders/user/my-orders", { params }),
  getById: (id: string) => axiosInstance.get(`/api/v1/orders/${id}`),
  cancel: (id: string) => axiosInstance.put(`/api/v1/orders/${id}/cancel`),
};
