import { Product, Category, Collection, ProductFilterParams, ProductReview } from "@/types/product.types";
import { MOCK_PRODUCTS, MOCK_CATEGORIES, MOCK_COLLECTIONS, MOCK_REVIEWS } from "./mockData";
import { productAPI } from "@/api/product.api";
import { categoryAPI } from "@/api/category.api";
import axiosInstance from "@/api/axiosInstance";
import { mapBackendProduct, mapBackendCategory } from "@/utils/dataMappers";

export const productService = {
  getProducts: async (filters?: ProductFilterParams): Promise<{ products: Product[]; total: number }> => {
    try {
      const apiFilters: any = {};
      if (filters?.category) apiFilters.category = filters.category;
      if (filters?.search) apiFilters.search = filters.search;
      if (filters?.metal && filters.metal.length > 0) apiFilters.metalType = filters.metal[0];
      if (filters?.minPrice !== undefined) apiFilters.minPrice = filters.minPrice;
      if (filters?.maxPrice !== undefined) apiFilters.maxPrice = filters.maxPrice;
      if (filters?.availability) apiFilters.inStock = true;
      if (filters?.sort) apiFilters.sort = filters.sort;

      const res = await productAPI.getAll(apiFilters);
      const rawData = res.data?.data || res.data;

      if (Array.isArray(rawData) && rawData.length > 0) {
        const products = rawData.map(mapBackendProduct);
        const total = res.data?.pagination?.total || products.length;
        return { products, total };
      }
    } catch {
      // Graceful fallback to mock data during local development
    }

    // Fallback filter logic on MOCK_PRODUCTS
    let list = [...MOCK_PRODUCTS];
    if (filters) {
      if (filters.category) {
        list = list.filter((p) => p.category.toLowerCase() === filters.category?.toLowerCase());
      }
      if (filters.search) {
        const q = filters.search.toLowerCase();
        list = list.filter(
          (p) =>
            p.name.toLowerCase().includes(q) ||
            p.description.toLowerCase().includes(q) ||
            p.category.toLowerCase().includes(q) ||
            p.sku.toLowerCase().includes(q)
        );
      }
      if (filters.metal && filters.metal.length > 0) {
        list = list.filter((p) => filters.metal?.includes(p.metal));
      }
      if (filters.purity && filters.purity.length > 0) {
        list = list.filter((p) => filters.purity?.includes(p.purity));
      }
      if (filters.minPrice !== undefined) {
        list = list.filter((p) => p.price >= filters.minPrice!);
      }
      if (filters.maxPrice !== undefined) {
        list = list.filter((p) => p.price <= filters.maxPrice!);
      }
      if (filters.availability) {
        list = list.filter((p) => p.stock > 0);
      }
      if (filters.sort === "price_asc") {
        list.sort((a, b) => a.price - b.price);
      } else if (filters.sort === "price_desc") {
        list.sort((a, b) => b.price - a.price);
      } else if (filters.sort === "rating") {
        list.sort((a, b) => b.rating - a.rating);
      } else if (filters.sort === "popular") {
        list.sort((a, b) => b.reviewsCount - a.reviewsCount);
      } else {
        list.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
      }
    }
    return { products: list, total: list.length };
  },

  getProductById: async (id: string): Promise<Product | undefined> => {
    try {
      const res = await productAPI.getById(id);
      const rawProduct = res.data?.data || res.data;
      if (rawProduct) {
        return mapBackendProduct(rawProduct);
      }
    } catch {
      // Fallback to mock
    }
    return MOCK_PRODUCTS.find((p) => p.id === id || p.slug === id);
  },

  getCategories: async (): Promise<Category[]> => {
    try {
      const res = await categoryAPI.getAll();
      const rawCats = res.data?.data || res.data;
      if (Array.isArray(rawCats) && rawCats.length > 0) {
        return rawCats.map(mapBackendCategory);
      }
    } catch {
      // Fallback
    }
    return MOCK_CATEGORIES;
  },

  getCollections: async (): Promise<Collection[]> => {
    try {
      const res = await axiosInstance.get("/api/v1/collections");
      const rawCols = res.data?.data || res.data;
      if (Array.isArray(rawCols) && rawCols.length > 0) {
        return rawCols.map((c: any) => ({
          id: c._id || c.id,
          name: c.name || c.title,
          slug: c.slug,
          description: c.description || "",
          banner: c.bannerImage || c.banner || c.image || "https://images.unsplash.com/photo-1573408301185-9146fe634ad0",
          productsCount: c.products?.length || 0,
          status: (c.isActive !== false ? "active" : "inactive") as "active" | "inactive",
          isFeatured: Boolean(c.isFeatured),
        }));
      }
    } catch {
      // Fallback
    }
    return MOCK_COLLECTIONS;
  },

  getProductReviews: async (productId: string): Promise<ProductReview[]> => {
    try {
      const res = await productAPI.getReviews(productId);
      const rawReviews = res.data?.data || res.data;
      if (Array.isArray(rawReviews) && rawReviews.length > 0) {
        return rawReviews.map((r: any) => ({
          id: r._id || r.id,
          productId: r.product || productId,
          customerName: r.user?.name || r.userName || "Verified Collector",
          customerEmail: r.user?.email || "collector@jewelo.com",
          rating: Number(r.rating || 5),
          title: r.title || "Exquisite Quality",
          comment: r.comment || "",
          verifiedPurchase: Boolean(r.isVerifiedPurchase ?? true),
          createdAt: r.createdAt || new Date().toISOString(),
          status: ((r.status || "approved").toLowerCase()) as any,
        }));
      }
    } catch {
      // Fallback
    }
    return MOCK_REVIEWS.filter((r) => r.productId === productId && r.status === "approved");
  },
};

export default productService;
