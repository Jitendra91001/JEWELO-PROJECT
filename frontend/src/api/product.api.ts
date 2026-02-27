import axiosInstance from "./axiosInstance";

export interface ProductFilters {
  category?: string;
  material?: string;
  minPrice?: number;
  maxPrice?: number;
  gender?: string;
  occasion?: string;
  sort?: string;
  page?: number;
  size?: number;
  search?: string;
}

export const productAPI = {
  getAll: (filters?: ProductFilters) => axiosInstance.get("/api/products", { params: filters }),
  getById: (id: string) => axiosInstance.get(`/api/products/${id}`),
  getFeatured: () => axiosInstance.get("/api/products/featured"),
  getNewArrivals: () => axiosInstance.get("/api/products/new-arrivals"),
  getBestSellers: () => axiosInstance.get("/api/products/best-sellers"),
  search: (query: string) => axiosInstance.get("/api/products/search", { params: { q: query } }),
};
