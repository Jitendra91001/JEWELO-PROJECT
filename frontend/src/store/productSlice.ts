import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import { productAPI } from "@/api/product.api";
import { categoryAPI } from "@/api/category.api";

export interface Product {
  id: string;
  name: string;
  description?: string;
  price: number;
  originalPrice?: number;
  cost?: number;
  sku?: string;
  quantity?: number;
  images: string[];
  thumbnail?: string;
  category?: {
    id: string;
    name: string;
  } | string;
  material?: string;
  weight?: string;
  purity?: string;
  gender?: string;
  occasion?: string;
  rating?: number;
  reviews?: number;
  inStock?: boolean;
  isActive?: boolean;
  isFeatured?: boolean;
  slug?: string;
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
}

interface ProductFetchResponse {
  content?: Product[];
  products?: Product[];
  totalPages?: number;
  currentPage?: number;
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
};

interface ProductFilters {
  category?: string;
  minPrice?: number;
  maxPrice?: number;
  search?: string;
}

export const fetchProducts = createAsyncThunk<
  Product[] | ProductFetchResponse,
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

export const fetchCategory = createAsyncThunk(
  "category/fetchAll",
  async (filters, { rejectWithValue }) => {
    try {
      const res = await categoryAPI.getAll();
      return res.data;
    } catch (err: unknown) {
      const message =
        err && typeof err === "object" && "response" in err &&
        typeof (err as ErrorResponse).response?.data?.message === "string"
          ? (err as ErrorResponse).response.data.message
          : "Failed to fetch products";
      return rejectWithValue(message);
    }
  },
);

export const fetchProductById = createAsyncThunk<Product,
  string,
  { rejectValue: string }>(
  "products/fetchById",
  async (id: string, { rejectWithValue }) => {
    try {
      const res = await productAPI.getById(id);
      return res.data;
    } catch (err: unknown) {
      return rejectWithValue("Failed to fetch product");
    }
  },
);

const productSlice = createSlice({
  name: "products",
  initialState,
  reducers: {
    clearCurrentProduct: (state) => {
      state.currentProduct = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchProducts.pending, (state) => {
        state.loading = true;
      })
      .addCase(
        fetchProducts.fulfilled,
        (state, action: PayloadAction<Product[] | ProductFetchResponse>) => {
          state.loading = false;
          const payload = action.payload;
          state.products = Array.isArray(payload)
            ? payload
            : payload.content || payload.products || [];
          state.totalPages = Array.isArray(payload)
            ? 1
            : payload.totalPages || 1;
          state.currentPage = Array.isArray(payload)
            ? 1
            : payload.currentPage || 1;
        },
      )
      .addCase(fetchProducts.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(fetchProductById.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchProductById.fulfilled, (state, action: PayloadAction<Product>) => {
        state.loading = false;
        state.currentProduct = action.payload;
      })
      .addCase(fetchProductById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export const { clearCurrentProduct } = productSlice.actions;
export default productSlice.reducer;
