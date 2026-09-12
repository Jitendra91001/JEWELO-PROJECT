import { Product, Category, Collection, ProductFilterParams, ProductReview } from '@/types/product.types';
import { MOCK_PRODUCTS, MOCK_CATEGORIES, MOCK_COLLECTIONS, MOCK_REVIEWS } from './mockData';

export const productService = {
  getProducts: async (filters?: ProductFilterParams): Promise<{ products: Product[]; total: number }> => {
    // Simulate network delay
    await new Promise((r) => setTimeout(r, 200));

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
      if (filters.gender && filters.gender.length > 0) {
        list = list.filter((p) => p.gender && filters.gender?.includes(p.gender));
      }

      // Sorting
      if (filters.sort === 'price_asc') {
        list.sort((a, b) => a.price - b.price);
      } else if (filters.sort === 'price_desc') {
        list.sort((a, b) => b.price - a.price);
      } else if (filters.sort === 'rating') {
        list.sort((a, b) => b.rating - a.rating);
      } else if (filters.sort === 'popular') {
        list.sort((a, b) => b.reviewsCount - a.reviewsCount);
      } else {
        // default newest
        list.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
      }
    }

    return { products: list, total: list.length };
  },

  getProductById: async (id: string): Promise<Product | undefined> => {
    await new Promise((r) => setTimeout(r, 150));
    return MOCK_PRODUCTS.find((p) => p.id === id || p.slug === id);
  },

  getCategories: async (): Promise<Category[]> => {
    return MOCK_CATEGORIES;
  },

  getCollections: async (): Promise<Collection[]> => {
    return MOCK_COLLECTIONS;
  },

  getProductReviews: async (productId: string): Promise<ProductReview[]> => {
    return MOCK_REVIEWS.filter((r) => r.productId === productId && r.status === 'approved');
  },
};
