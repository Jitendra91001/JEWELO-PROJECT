import axiosInstance from "./axiosInstance";

export const categoryAPI = {
  getAll: () => axiosInstance.get("/api/v1/categories"),
  getById: (id: string) => axiosInstance.get(`/api/categories/${id}`),
};
