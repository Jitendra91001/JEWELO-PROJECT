import axiosInstance from "./axiosInstance";

export const adminAPI = {
  // Dashboard
  getDashboard: () => axiosInstance.get("/api/admin/dashboard"),

  // Products
  getProducts: (params?: unknown) => axiosInstance.get("/api/v1/admin/products", { params }),
  createProduct: (data : unknown) => axiosInstance.post("/api/v1/products", data, { headers: { "Content-Type": "multipart/form-data" } }),
  updateProduct: (id: string, data: FormData) => axiosInstance.put(`/api/v1/admin/products/${id}`, data, { headers: { "Content-Type": "multipart/form-data" } }),
  deleteProduct: (id: string) => axiosInstance.delete(`/api/v1/admin/products/${id}`),
  toggleProductStatus: (id: string) => axiosInstance.put(`/api/v1/admin/products/${id}/toggle`),

  // Categories
  getCategories: () => axiosInstance.get("/api/v1/admin/categories"),
  createCategory: (data: any) => axiosInstance.post("/api/v1/admin/categories", data),
  updateCategory: (id: string, data: any) => axiosInstance.put(`/api/v1/admin/categories/${id}`, data),
  deleteCategory: (id: string) => axiosInstance.delete(`/api/v1/admin/categories/${id}`),

  // Orders
  getOrders: (params?: any) => axiosInstance.get("/api/v1/admin/orders", { params }),
  getOrderById: (id: string) => axiosInstance.get(`/api/v1/admin/orders/${id}`),
  updateOrderStatus: (id: string, status: string) => axiosInstance.put(`/api/v1/admin/orders/${id}/status`, { status }),

  // Users
  getUsers: (params?: any) => axiosInstance.get("/api/v1/admin/users", { params }),
  toggleUserStatus: (id: string) => axiosInstance.put(`/api/v1/admin/users/${id}/toggle`),

  // Reports
  getSalesReport: (params?: any) => axiosInstance.get("/api/v1/admin/reports/sales", { params }),
  getProductReport: () => axiosInstance.get("/api/v1/admin/reports/products"),

  // Settings
  getSettings: () => axiosInstance.get("/api/v1/admin/settings"),
  updateSettings: (data: any) => axiosInstance.put("/api/v1/admin/settings", data),

  // Coupons
  getCoupons: () => axiosInstance.get("/api/v1/admin/coupons"),
  createCoupon: (data: any) => axiosInstance.post("/api/v1/admin/coupons", data),
  deleteCoupon: (id: string) => axiosInstance.delete(`/api/v1/admin/coupons/${id}`),
};
