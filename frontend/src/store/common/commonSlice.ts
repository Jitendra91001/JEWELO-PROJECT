import { createSlice } from "@reduxjs/toolkit";
import {
  getDropdownCategory,
  getDropdownproducts,
  getDropdownuser,
} from "./commonThunk";

const initialState = {
  loading: false,
  categories: [],
  users: [],
  products: [],
};
const commonSlice = createSlice({
  name: "common",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(getDropdownproducts.pending, (state) => {
        state.loading = true;
      })
      .addCase(getDropdownproducts.fulfilled, (state, action) => {
        state.loading = false;
        state.products = action.payload.product;
      })
      .addCase(getDropdownproducts.rejected, (state) => {
        state.loading = true;
      })
      .addCase(getDropdownuser.pending, (state) => {
        state.loading = true;
      })
      .addCase(getDropdownuser.fulfilled, (state, action) => {
        state.loading = false;
        state.users = action.payload.user;
      })
      .addCase(getDropdownuser.rejected, (state) => {
        state.loading = true;
      })
      .addCase(getDropdownCategory.pending, (state) => {
        state.loading = true;
      })
      .addCase(getDropdownCategory.fulfilled, (state, action) => {
        state.loading = false;
        state.categories = action.payload.categories;
      })
      .addCase(getDropdownCategory.rejected, (state) => {
        state.loading = true;
      });
  },
});

export default commonSlice.reducer;
