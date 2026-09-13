import axiosInstance from "./axiosInstance";

export const adminAPI = {
  // Dashboard & Analytics
  getDashboard: () => axiosInstance.get("/api/v1/admin/dashboard"),
  getDashboardRevenue: () => axiosInstance.get("/api/v1/admin/dashboard/revenue"),
  getDashboardOrders: () => axiosInstance.get("/api/v1/admin/dashboard/orders"),
  getDashboardProducts: () => axiosInstance.get("/api/v1/admin/dashboard/products"),
  getDashboardCustomers: () => axiosInstance.get("/api/v1/admin/dashboard/customers"),
  getDashboardInventory: () => axiosInstance.get("/api/v1/admin/dashboard/inventory"),

  // Products
  getProducts: (params?: unknown) => axiosInstance.get("/api/v1/products", { params }),
  getProductsById: (id: string) => axiosInstance.get(`/api/v1/products/${id}`),
  createProduct: (data: unknown) =>
    axiosInstance.post("/api/v1/products", data, { headers: { "Content-Type": "multipart/form-data" } }),
  updateProduct: (id: string, data: FormData | Record<string, unknown>) =>
    axiosInstance.put(`/api/v1/products/${id}`, data, {
      headers: data instanceof FormData ? { "Content-Type": "multipart/form-data" } : { "Content-Type": "application/json" },
    }),
  deleteProduct: (id: string) => axiosInstance.delete(`/api/v1/products/${id}`),
  toggleProductStatus: (id: string, isActive: boolean) => axiosInstance.patch(`/api/v1/products/${id}/status`, { isActive }),

  // Categories
  getCategories: (params?: { search?: string; active?: string }) => axiosInstance.get("/api/v1/categories", { params }),
  createCategory: (data: any) =>
    axiosInstance.post("/api/v1/categories", data, {
      headers: data instanceof FormData ? { "Content-Type": "multipart/form-data" } : { "Content-Type": "application/json" },
    }),
  updateCategory: (id: string, data: any) =>
    axiosInstance.put(`/api/v1/categories/${id}`, data, {
      headers: data instanceof FormData ? { "Content-Type": "multipart/form-data" } : { "Content-Type": "application/json" },
    }),
  deleteCategory: (id: string) => axiosInstance.delete(`/api/v1/categories/${id}`),
  toggleCategoryStatus: (id: string) => axiosInstance.patch(`/api/v1/categories/${id}/status`),

  // Orders
  getOrders: (params?: any) => axiosInstance.get("/api/v1/orders", { params }),
  getOrderById: (id: string) => axiosInstance.get(`/api/v1/orders/${id}`),
  updateOrderStatus: (id: string, status: string) => axiosInstance.patch(`/api/v1/orders/${id}/status`, { status }),

  // Users & Staff
  getUsers: (params?: any) => axiosInstance.get("/api/v1/admin/users", { params }),
  updateUserRole: (id: string, role: string) => axiosInstance.patch(`/api/v1/admin/users/${id}/role`, { role }),
  getRoles: () => axiosInstance.get("/api/v1/admin/roles"),
  toggleUserStatus: (id: string) => axiosInstance.patch(`/api/v1/admin/users/${id}/status`),

  // Vault Inventory
  getInventory: (params?: any) => axiosInstance.get("/api/v1/inventory", { params }),
  adjustInventory: (productId: string, data: { quantity: number; reason: string }) =>
    axiosInstance.patch(`/api/v1/inventory/${productId}/adjust`, data),

  // Coupons
  getCoupons: (params?: any) => axiosInstance.get("/api/v1/admin/coupons", { params }),
  createCoupon: (data: any) => axiosInstance.post("/api/v1/admin/coupons", data),
  updateCoupon: (id: string, data: any) => axiosInstance.put(`/api/v1/admin/coupons/${id}`, data),
  deleteCoupon: (id: string) => axiosInstance.delete(`/api/v1/admin/coupons/${id}`),

  // Banners / CMS
  getBanners: () => axiosInstance.get("/api/v1/banners"),
  createBanner: (data: any) =>
    axiosInstance.post("/api/v1/banners", data, {
      headers: data instanceof FormData ? { "Content-Type": "multipart/form-data" } : { "Content-Type": "application/json" },
    }),
  updateBanner: (id: string, data: any) =>
    axiosInstance.put(`/api/v1/banners/${id}`, data, {
      headers: data instanceof FormData ? { "Content-Type": "multipart/form-data" } : { "Content-Type": "application/json" },
    }),
  deleteBanner: (id: string) => axiosInstance.delete(`/api/v1/banners/${id}`),

  // Reviews Moderation
  getReviews: (params?: any) => axiosInstance.get("/api/v1/admin/reviews", { params }),
  approveReview: (id: string) => axiosInstance.patch(`/api/v1/reviews/${id}/approve`),
  rejectReview: (id: string) => axiosInstance.patch(`/api/v1/reviews/${id}/reject`),
  deleteReview: (id: string) => axiosInstance.delete(`/api/v1/reviews/${id}`),

  // Returns
  getReturns: (params?: any) => axiosInstance.get("/api/v1/admin/returns", { params }),
  getReturnById: (id: string) => axiosInstance.get(`/api/v1/admin/returns/${id}`),
  updateReturnStatus: (id: string, status: string) => axiosInstance.patch(`/api/v1/returns/${id}/status`, { status }),

  // Reports
  getSalesReport: (params?: any) => axiosInstance.get("/api/v1/reports/sales", { params }),
  getProductReport: () => axiosInstance.get("/api/v1/reports/products"),
  getRevenueReport: (params?: any) => axiosInstance.get("/api/v1/reports/revenue", { params }),
  getInventoryReport: () => axiosInstance.get("/api/v1/reports/inventory"),

  // Settings
  getSettings: () => axiosInstance.get("/api/v1/settings"),
  updateSettings: (data: any) => axiosInstance.put("/api/v1/settings", data),

  // Notifications
  getNotifications: () => axiosInstance.get("/api/v1/notifications"),
};

export default adminAPI;
