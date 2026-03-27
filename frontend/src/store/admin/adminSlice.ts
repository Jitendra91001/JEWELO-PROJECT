import { createSlice } from "@reduxjs/toolkit";
import { postProduct } from "./adminThunk";

const initialState = {
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
const adminProductSlice = createSlice({
  name: "admin",
  initialState,
  reducers: {
    clearCurrentProduct: (state) => {
      state.currentProduct = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(postProduct.pending, (state) => {
        state.loading = true;
      })
      .addCase(postProduct.fulfilled, (state, action) => {
        state.loading = false;
        state.products =
          action.payload.content ||
          action.payload.products ||
          action.payload ||
          [];
        state.totalPages = action.payload.totalPages || 1;
        state.currentPage = action.payload.currentPage || 1;
      })
      .addCase(postProduct.rejected, (state) => {
        state.loading = true;
      });
  },
});

export const { clearCurrentProduct } = adminProductSlice.actions;
export default adminProductSlice.reducer;
