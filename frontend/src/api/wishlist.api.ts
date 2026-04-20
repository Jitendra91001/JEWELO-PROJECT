import axiosInstance from "./axiosInstance";

export const wishlistAPI = {
  getAll: () => axiosInstance.get("/api/v1/wishlist"),
  add: (productId: string) => axiosInstance.post("/api/v1/wishlist", { productId }),
  remove: (productId: string) => axiosInstance.delete(`/api/v1/wishlist/${productId}`),
};
