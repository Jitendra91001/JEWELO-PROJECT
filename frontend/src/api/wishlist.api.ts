import axiosInstance from "./axiosInstance";

export const wishlistAPI = {
  getAll: () => axiosInstance.get("/api/wishlist"),
  add: (productId: string) => axiosInstance.post("/api/wishlist", { productId }),
  remove: (productId: string) => axiosInstance.delete(`/api/wishlist/${productId}`),
};
