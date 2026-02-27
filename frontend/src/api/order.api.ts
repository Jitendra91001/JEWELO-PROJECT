import axiosInstance from "./axiosInstance";

export interface OrderPayload {
  addressId: string;
  paymentMethod: string;
}

export const orderAPI = {
  create: (data: OrderPayload) => axiosInstance.post("/api/orders", data),
  getAll: () => axiosInstance.get("/api/orders"),
  getById: (id: string) => axiosInstance.get(`/api/orders/${id}`),
  cancel: (id: string) => axiosInstance.put(`/api/orders/${id}/cancel`),
};
