import axiosInstance from "./axiosInstance";

export interface OrderPayload {
  addressId: string;
  paymentMethod: string;
}

export const orderAPI = {
  create: (data: OrderPayload) => axiosInstance.post("/api/v1/orders", data),
  getAll: () => axiosInstance.get("/api/v1/orders"),
  getById: (id: string) => axiosInstance.get(`/api/v1/orders/${id}`),
  cancel: (id: string) => axiosInstance.put(`/api/v1/orders/${id}/cancel`),
};
