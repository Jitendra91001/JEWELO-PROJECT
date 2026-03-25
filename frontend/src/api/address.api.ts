import axiosInstance from "./axiosInstance";

export interface AddressPayload {
  name: string;
  phone: string;
  line1: string;
  line2?: string;
  city: string;
  state: string;
  pincode: string;
  isDefault?: boolean;
}

export const addressAPI = {
  getAll: () => axiosInstance.get("/api/v1/addresses"),
  add: (data: AddressPayload) => axiosInstance.post("/api/v1/addresses", data),
  update: (id: string, data: AddressPayload) => axiosInstance.put(`/api/v1/addresses/${id}`, data),
  delete: (id: string) => axiosInstance.delete(`/api/v1/addresses/${id}`),
  setDefault: (id: string) => axiosInstance.put(`/api/v1/addresses/${id}/default`),
};
