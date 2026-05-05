import axiosInstance from "./axiosInstance";

export const cartAPI = {
  getCart: () => axiosInstance.get("/api/v1/cart"),
  addToCart: (productId: string, quantity: number) =>
    axiosInstance.post("/api/v1/cart", { productId, quantity }),
  updateQuantity: (productId: string, quantity: number) =>
    axiosInstance.patch(`/api/v1/cart/${productId}`, { quantity }),
  removeItem: (productId: string) => axiosInstance.delete(`/api/v1/cart/${productId}`),
  clearCart: () => axiosInstance.delete("/api/v1/cart"),
};
