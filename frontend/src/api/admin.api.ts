import axiosInstance from "./axiosInstance";

export const adminAPI = {
  // Dashboard
  getDashboard: () => axiosInstance.get("/api/v1/admin/dashboard"),

  // Products
  getProducts: (params?: unknown) => axiosInstance.get("/api/v1/products", { params }),
  getProductsById: (params:unknown) => axiosInstance.get(`/api/v1/products/${params}`,),
  createProduct: (data : unknown) => axiosInstance.post("/api/v1/products", data, { headers: { "Content-Type": "multipart/form-data" } }),
  updateProduct: (id: string, data: FormData | Record<string, unknown>) => axiosInstance.put(`/api/v1/products/${id}`, data, { headers: data instanceof FormData ? { "Content-Type": "multipart/form-data" } : { "Content-Type": "application/json" } }),
  deleteProduct: (id: string) => axiosInstance.delete(`/api/v1/products/${id}`),
  toggleProductStatus: (id: string, isActive: boolean) => axiosInstance.put(`/api/v1/products/${id}`, { isActive }),

  // Categories
  getCategories: (params?: { search?: string; active?: string }) => axiosInstance.get("/api/v1/categories", { params }),
  createCategory: (data: any) => axiosInstance.post("/api/v1/categories", data),
  updateCategory: (id: string, data: any) => axiosInstance.put(`/api/v1/categories/${id}`, data),
  deleteCategory: (id: string) => axiosInstance.delete(`/api/v1/categories/${id}`),
  toggleCategoryStatus: (id: string) => axiosInstance.put(`/api/v1/categories/${id}/toggle`),

  // Orders
  getOrders: (params?: any) => axiosInstance.get("/api/v1/orders", { params }),
  getOrderById: (id: string) => axiosInstance.get(`/api/v1/orders/${id}`),
  updateOrderStatus: (id: string, status: string) => axiosInstance.patch(`/api/v1/orders/${id}/status`, { status }),

  // Users
  getUsers: (params?: any) => axiosInstance.get("/api/v1/users", { params }),
  toggleUserStatus: (id: string) => axiosInstance.put(`/api/v1/users/${id}/toggle`),

  // Reports
  getSalesReport: (params?: any) => axiosInstance.get("/api/v1/reports/sales", { params }),
  getProductReport: () => axiosInstance.get("/api/v1/reports/products"),

  // Settings
  getSettings: () => axiosInstance.get("/api/v1/settings"),
  updateSettings: (data: any) => axiosInstance.put("/api/v1/settings", data),

  // Coupons
  getCoupons: () => axiosInstance.get("/api/v1/coupons"),
  createCoupon: (data: any) => axiosInstance.post("/api/v1/coupons", data),
  updateCoupon: (id: string, data: any) => axiosInstance.put(`/api/v1/coupons/${id}`, data),
  deleteCoupon: (id: string) => axiosInstance.delete(`/api/v1/coupons/${id}`),
};
