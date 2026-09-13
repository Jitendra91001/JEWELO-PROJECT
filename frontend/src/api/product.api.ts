import axiosInstance from "./axiosInstance";

export interface ProductFilters {
  category?: string;
  metalType?: string;
  material?: string;
  minPrice?: number;
  maxPrice?: number;
  gender?: string;
  occasion?: string;
  diamondShape?: string;
  inStock?: boolean;
  sort?: string;
  page?: number;
  limit?: number;
  size?: number;
  search?: string;
}

export const productAPI = {
  getAll: (filters?: ProductFilters) => axiosInstance.get("/api/v1/products", { params: filters }),
  getById: (id: string) => axiosInstance.get(`/api/v1/products/${id}`),
  getFeatured: () => axiosInstance.get("/api/v1/products/featured"),
  getNewArrivals: () => axiosInstance.get("/api/v1/products/new-arrivals"),
  getBestSellers: () => axiosInstance.get("/api/v1/products/best-sellers"),
  search: (query: string) => axiosInstance.get("/api/v1/products/search", { params: { q: query } }),
  getCertificateUrl: (id: string) => `${axiosInstance.defaults.baseURL}/api/v1/products/${id}/certificate`,
  getReviews: (productId: string) => axiosInstance.get("/api/v1/reviews", { params: { product: productId } }),
  addReview: (data: { productId: string; rating: number; title?: string; comment?: string }) =>
    axiosInstance.post("/api/v1/reviews", data),
};

export default productAPI;
