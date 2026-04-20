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
  updateCoupon: (id: string, data: any) => axiosInstance.put(`/api/v1/admin/coupons/${id}`, data),
  deleteCoupon: (id: string) => axiosInstance.delete(`/api/v1/admin/coupons/${id}`),
};
