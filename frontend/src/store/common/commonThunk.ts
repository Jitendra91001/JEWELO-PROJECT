import { adminAPI } from "@/api/admin.api";
import { createAsyncThunk } from "@reduxjs/toolkit";

export const getDropdowntData = createAsyncThunk(
  "dropdown/get",
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
