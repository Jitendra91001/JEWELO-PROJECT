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
  getAll: () => axiosInstance.get("/api/addresses"),
  add: (data: AddressPayload) => axiosInstance.post("/api/addresses", data),
  update: (id: string, data: AddressPayload) => axiosInstance.put(`/api/addresses/${id}`, data),
  delete: (id: string) => axiosInstance.delete(`/api/addresses/${id}`),
  setDefault: (id: string) => axiosInstance.put(`/api/addresses/${id}/default`),
};
