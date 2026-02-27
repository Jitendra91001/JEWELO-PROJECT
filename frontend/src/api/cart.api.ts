import axiosInstance from "./axiosInstance";

export const cartAPI = {
  getCart: () => axiosInstance.get("/api/cart"),
  addToCart: (productId: string, quantity: number) =>
    axiosInstance.post("/api/cart", { productId, quantity }),
  updateQuantity: (itemId: string, quantity: number) =>
    axiosInstance.put(`/api/cart/${itemId}`, { quantity }),
  removeItem: (itemId: string) => axiosInstance.delete(`/api/cart/${itemId}`),
  clearCart: () => axiosInstance.delete("/api/cart"),
};
