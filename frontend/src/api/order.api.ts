import axiosInstance from "./axiosInstance";

export interface OrderItemPayload {
  productId: string;
  quantity: number;
  ringSize?: number;
  engraving?: string;
}

export interface OrderPayload {
  items?: OrderItemPayload[];
  shippingAddress: string | Record<string, any>;
  billingAddress?: string | Record<string, any>;
  paymentMethod: string;
  couponCode?: string;
  orderNotes?: string;
}

export const orderAPI = {
  create: (data: OrderPayload) => axiosInstance.post("/api/v1/orders", data),
  getMyOrders: (params?: Record<string, unknown>) => axiosInstance.get("/api/v1/orders/user/my-orders", { params }),
  getById: (id: string) => axiosInstance.get(`/api/v1/orders/${id}`),
  cancel: (id: string, reason?: string) => axiosInstance.post(`/api/v1/orders/${id}/cancel`, { reason }),
  getInvoiceUrl: (id: string) => `${axiosInstance.defaults.baseURL}/api/v1/orders/${id}/invoice`,
};

export default orderAPI;
