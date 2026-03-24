import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import { productAPI, ProductFilters } from "@/api/product.api";
import { categoryAPI } from "@/api/category.api";

export interface Product {
  id: string;
  name: string;
  description?: string;
  price: number;
  originalPrice?: number;
  images: string[];
  category?: string;
  material?: string;
  weight?: string;
  purity?: string;
  gender?: string;
  occasion?: string;
  rating?: number;
  reviews?: number;
  inStock?: boolean;
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

export const fetchProducts = createAsyncThunk("products/fetchAll", async (filters: ProductFilters | undefined, { rejectWithValue }) => {
  try {
    const res = await productAPI.getAll(filters);
    return res.data;
  } catch (err: any) {
    return rejectWithValue(err.response?.data?.message || "Failed to fetch products");
  }
});

export const fetchCategory = createAsyncThunk("category/fetchAll", async (filters: ProductFilters | undefined, { rejectWithValue }) => {
  try {
    const res = await categoryAPI.getAll();
    return res.data;
  } catch (err: any) {
    return rejectWithValue(err.response?.data?.message || "Failed to fetch products");
  }
});

export const fetchProductById = createAsyncThunk("products/fetchById", async (id: string, { rejectWithValue }) => {
  try {
    const res = await productAPI.getById(id);
    return res.data;
  } catch (err: any) {
    return rejectWithValue("Failed to fetch product");
  }
});

const productSlice = createSlice({
  name: "products",
  initialState,
  reducers: {
    clearCurrentProduct: (state) => { state.currentProduct = null; },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchProducts.pending, (state) => { state.loading = true; })
      .addCase(fetchProducts.fulfilled, (state, action: PayloadAction<any>) => {
        state.loading = false;
        state.products = action.payload.content || action.payload.products || action.payload || [];
        state.totalPages = action.payload.totalPages || 1;
        state.currentPage = action.payload.currentPage || 1;
      })
      .addCase(fetchProducts.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(fetchProductById.pending, (state) => { state.loading = true; })
      .addCase(fetchProductById.fulfilled, (state, action: PayloadAction<any>) => {
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
