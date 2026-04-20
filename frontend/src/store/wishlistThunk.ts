import { wishlistAPI } from "@/api/wishlist.api";
import { createAsyncThunk } from "@reduxjs/toolkit";

interface ApiError {
  response?: { data?: { message?: string } };
}

export const getWishlist = createAsyncThunk<any[], void, { rejectValue: string }>(
  "wishlist/get",
  async (_, { rejectWithValue }) => {
    try {
      const res = await wishlistAPI.getAll();
      return res.data;
    } catch (err: unknown) {
      const message =
        err && typeof err === "object" && "response" in err &&
        typeof (err as ApiError).response?.data?.message === "string"
          ? (err as ApiError).response.data.message
          : "Failed to fetch wishlist";
      return rejectWithValue(message);
    }
  },
);

export const addToWishlist = createAsyncThunk<any, string, { rejectValue: string }>(
  "wishlist/add",
  async (productId, { rejectWithValue }) => {
    try {
      const res = await wishlistAPI.add(productId);
      return res.data;
    } catch (err: unknown) {
      const message =
        err && typeof err === "object" && "response" in err &&
        typeof (err as ApiError).response?.data?.message === "string"
          ? (err as ApiError).response.data.message
          : "Failed to add to wishlist";
      return rejectWithValue(message);
    }
  },
);

export const removeFromWishlist = createAsyncThunk<string, string, { rejectValue: string }>(
  "wishlist/remove",
  async (productId, { rejectWithValue }) => {
    try {
      await wishlistAPI.remove(productId);
      return productId;
    } catch (err: unknown) {
      const message =
        err && typeof err === "object" && "response" in err &&
        typeof (err as ApiError).response?.data?.message === "string"
          ? (err as ApiError).response.data.message
          : "Failed to remove from wishlist";
      return rejectWithValue(message);
    }
  },
);