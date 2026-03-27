import axiosInstance from "./axiosInstance";

export const adminAPI = {
  // Dashboard
  getDashboard: () => axiosInstance.get("/api/admin/dashboard"),

  // Products
  getProducts: (params?: unknown) => axiosInstance.get("/api/admin/products", { params }),
  createProduct: (data : unknown) => axiosInstance.post("/api/admin/products", data, { headers: { "Content-Type": "multipart/form-data" } }),
  updateProduct: (id: string, data: FormData) => axiosInstance.put(`/api/admin/products/${id}`, data, { headers: { "Content-Type": "multipart/form-data" } }),
  deleteProduct: (id: string) => axiosInstance.delete(`/api/admin/products/${id}`),
  toggleProductStatus: (id: string) => axiosInstance.put(`/api/admin/products/${id}/toggle`),

  // Categories
  getCategories: () => axiosInstance.get("/api/admin/categories"),
  createCategory: (data: any) => axiosInstance.post("/api/admin/categories", data),
  updateCategory: (id: string, data: any) => axiosInstance.put(`/api/admin/categories/${id}`, data),
  deleteCategory: (id: string) => axiosInstance.delete(`/api/admin/categories/${id}`),

  // Orders
  getOrders: (params?: any) => axiosInstance.get("/api/admin/orders", { params }),
  getOrderById: (id: string) => axiosInstance.get(`/api/admin/orders/${id}`),
  updateOrderStatus: (id: string, status: string) => axiosInstance.put(`/api/admin/orders/${id}/status`, { status }),

  // Users
  getUsers: (params?: any) => axiosInstance.get("/api/admin/users", { params }),
  toggleUserStatus: (id: string) => axiosInstance.put(`/api/admin/users/${id}/toggle`),

  // Reports
  getSalesReport: (params?: any) => axiosInstance.get("/api/admin/reports/sales", { params }),
  getProductReport: () => axiosInstance.get("/api/admin/reports/products"),

  // Settings
  getSettings: () => axiosInstance.get("/api/admin/settings"),
  updateSettings: (data: any) => axiosInstance.put("/api/admin/settings", data),

  // Coupons
  getCoupons: () => axiosInstance.get("/api/admin/coupons"),
  createCoupon: (data: any) => axiosInstance.post("/api/admin/coupons", data),
  deleteCoupon: (id: string) => axiosInstance.delete(`/api/admin/coupons/${id}`),
};
