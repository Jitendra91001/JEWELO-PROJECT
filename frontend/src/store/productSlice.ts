import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import { productAPI, ProductFilters } from "@/api/product.api";
import { categoryAPI } from "@/api/category.api";
import { mapBackendProduct } from "@/utils/dataMappers";

export interface Product {
  id: string;
  _id?: string;
  name: string;
  description?: string;
  price: number;
  originalPrice?: number;
  comparePrice?: number;
  cost?: number;
  sku?: string;
  stock?: number;
  quantity?: number;
  images: string[];
  thumbnail?: string;
  category?: {
    id?: string;
    name: string;
  } | string;
  categoryId?: string;
  material?: string;
  metal?: string;
  weight?: string;
  purity?: string;
  gender?: string;
  occasion?: string;
  rating?: number;
  reviews?: number;
  reviewsCount?: number;
  inStock?: boolean;
  isActive?: boolean;
  isFeatured?: boolean;
  isBestseller?: boolean;
  isNewArrival?: boolean;
  slug?: string;
  diamondDetails?: any;
  tags?: string[];
  createdAt?: string;
}

interface ProductState {
  products: Product[];
  featured: Product[];
  newArrivals: Product[];
  bestSellers: Product[];
  currentProduct: Product | null;
  loading: boolean;
  error: string | null;
  totalPages: number;
  currentPage: number;
  totalProducts: number;
}

interface ErrorResponse {
  response?: { data?: { message?: string } };
}

const initialState: ProductState = {
  products: [],
  featured: [],
  newArrivals: [],
  bestSellers: [],
  currentProduct: null,
  loading: false,
  error: null,
  totalPages: 1,
  currentPage: 1,
  totalProducts: 0,
};

export const fetchProducts = createAsyncThunk<
  any,
  ProductFilters | undefined,
  { rejectValue: string }
>("products/fetchAll", async (filters, { rejectWithValue }) => {
  try {
    const res = await productAPI.getAll(filters);
    return res.data;
  } catch (err: unknown) {
    const message =
      err && typeof err === "object" && "response" in err &&
      typeof (err as ErrorResponse).response?.data?.message === "string"
        ? (err as ErrorResponse).response.data.message
        : "Failed to fetch products";
    return rejectWithValue(message);
  }
});

export const fetchFeaturedProducts = createAsyncThunk<any, void, { rejectValue: string }>(
  "products/fetchFeatured",
  async (_, { rejectWithValue }) => {
    try {
      const res = await productAPI.getFeatured();
      return res.data;
    } catch (err: unknown) {
      return rejectWithValue("Failed to fetch featured products");
    }
  }
);

export const fetchNewArrivals = createAsyncThunk<any, void, { rejectValue: string }>(
  "products/fetchNewArrivals",
  async (_, { rejectWithValue }) => {
    try {
      const res = await productAPI.getNewArrivals();
      return res.data;
    } catch (err: unknown) {
      return rejectWithValue("Failed to fetch new arrivals");
    }
  }
);

export const fetchBestSellers = createAsyncThunk<any, void, { rejectValue: string }>(
  "products/fetchBestSellers",
  async (_, { rejectWithValue }) => {
    try {
      const res = await productAPI.getBestSellers();
      return res.data;
    } catch (err: unknown) {
      return rejectWithValue("Failed to fetch bestsellers");
    }
  }
);

export const fetchCategory = createAsyncThunk(
  "category/fetchAll",
  async (_, { rejectWithValue }) => {
    try {
      const res = await categoryAPI.getAll();
      return res.data;
    } catch (err: unknown) {
      return rejectWithValue("Failed to fetch categories");
    }
  }
);

export const fetchProductById = createAsyncThunk<any, string, { rejectValue: string }>(
  "products/fetchById",
  async (id: string, { rejectWithValue }) => {
    try {
      const res = await productAPI.getById(id);
      return res.data;
    } catch (err: unknown) {
      return rejectWithValue("Failed to fetch product");
    }
  }
);

const productSlice = createSlice({
  name: "products",
  initialState,
  reducers: {
    clearCurrentProduct: (state) => {
      state.currentProduct = null;
    },
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // All Products
      .addCase(fetchProducts.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchProducts.fulfilled, (state, action: PayloadAction<any>) => {
        state.loading = false;
        const payload = action.payload;
        const rawList = Array.isArray(payload)
          ? payload
          : Array.isArray(payload?.data)
          ? payload.data
          : payload?.products || payload?.content || [];

        state.products = rawList.map(mapBackendProduct).filter(Boolean);
        state.totalPages = payload?.pagination?.totalPages || payload?.totalPages || 1;
        state.currentPage = payload?.pagination?.page || payload?.currentPage || 1;
        state.totalProducts = payload?.pagination?.total || state.products.length;
      })
      .addCase(fetchProducts.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })

      // Featured
      .addCase(fetchFeaturedProducts.fulfilled, (state, action: PayloadAction<any>) => {
        const raw = action.payload?.data || action.payload;
        if (Array.isArray(raw)) {
          state.featured = raw.map(mapBackendProduct).filter(Boolean);
        }
      })

      // New Arrivals
      .addCase(fetchNewArrivals.fulfilled, (state, action: PayloadAction<any>) => {
        const raw = action.payload?.data || action.payload;
        if (Array.isArray(raw)) {
          state.newArrivals = raw.map(mapBackendProduct).filter(Boolean);
        }
      })

      // Best Sellers
      .addCase(fetchBestSellers.fulfilled, (state, action: PayloadAction<any>) => {
        const raw = action.payload?.data || action.payload;
        if (Array.isArray(raw)) {
          state.bestSellers = raw.map(mapBackendProduct).filter(Boolean);
        }
      })

      // Product by ID
      .addCase(fetchProductById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchProductById.fulfilled, (state, action: PayloadAction<any>) => {
        state.loading = false;
        const raw = action.payload?.data || action.payload;
        state.currentProduct = mapBackendProduct(raw);
      })
      .addCase(fetchProductById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export const { clearCurrentProduct, clearError } = productSlice.actions;
export default productSlice.reducer;
