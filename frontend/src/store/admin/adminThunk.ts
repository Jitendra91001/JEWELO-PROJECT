import { adminAPI } from "@/api/admin.api";
import { createAsyncThunk } from "@reduxjs/toolkit";

interface UpdateProductPayload {
  id: string;
  data: FormData;
}

export const postProduct = createAsyncThunk(
  "products/create",
  async (data, { rejectWithValue }) => {
    try {
      const res = await adminAPI.createProduct(data);
      return res.data;
    } catch (err: any) {
      return rejectWithValue(
        err.response?.data?.message || "Failed to fetch products",
      );
    }
  },
);

export const updateProduct = createAsyncThunk<
  any,
  UpdateProductPayload
>("products/update", async ({ id, data }, { rejectWithValue }) => {
  try {
    const res = await adminAPI.updateProduct(id, data);
    return res.data;
  } catch (err: any) {
    return rejectWithValue(
      err.response?.data?.message || "Failed to update product",
    );
  }
});

export const getProductById = createAsyncThunk<
  any,
>("products/update", async ({ id }, { rejectWithValue }) => {
  try {
    const res = await adminAPI.getProductsById(id);
    return res.data;
  } catch (err: any) {
    return rejectWithValue(
      err.response?.data?.message || "Failed to update product",
    );
  }
});
