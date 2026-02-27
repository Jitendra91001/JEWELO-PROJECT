import axiosInstance from "./axiosInstance";

export const categoryAPI = {
  getAll: () => axiosInstance.get("/api/categories"),
  getById: (id: string) => axiosInstance.get(`/api/categories/${id}`),
};
