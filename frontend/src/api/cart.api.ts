import axiosInstance from "./axiosInstance";

export const cartAPI = {
  getCart: () => axiosInstance.get("/api/v1/cart"),
  addToCart: (productId: string, quantity: number) =>
    axiosInstance.post("/api/v1/cart", { productId, quantity }),
  updateQuantity: (itemId: string, quantity: number) =>
    axiosInstance.put(`/api/v1/cart/${itemId}`, { quantity }),
  removeItem: (itemId: string) => axiosInstance.delete(`/api/v1/cart/${itemId}`),
  clearCart: () => axiosInstance.delete("/api/v1/cart"),
};
