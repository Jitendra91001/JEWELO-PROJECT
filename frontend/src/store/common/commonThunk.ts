import { adminAPI } from "@/api/admin.api";
import { createAsyncThunk } from "@reduxjs/toolkit";

export const getDropdownproducts = createAsyncThunk(
  "dropdown/products/get",
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
export const getDropdownuser = createAsyncThunk(
  "dropdown/user/get",
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
export const getDropdownCategory = createAsyncThunk(
  "dropdown/category/get",
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
