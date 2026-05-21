import { cartAPI } from "@/api/cart.api";
import { createAsyncThunk } from "@reduxjs/toolkit";
import type { CartItem } from "./cartSlice";

interface ApiError {
  response?: { data?: { message?: string } };
}

interface ApiResponse<T> {
  data: T;
  success?: boolean;
}

export const getCart = createAsyncThunk<ApiResponse<{ items: CartItem[]; subtotal: number; itemCount: number }>, void, { rejectValue: string }>(
  "cart/get",
  async (_, { rejectWithValue }) => {
    try {
      const res = await cartAPI.getCart();
      return res.data;
    } catch (err: unknown) {
      const message =
        err && typeof err === "object" && "response" in err &&
        typeof (err as ApiError).response?.data?.message === "string"
          ? (err as ApiError).response.data.message
          : "Failed to fetch cart";
      return rejectWithValue(message);
    }
  },
);

export const addToCart = createAsyncThunk<ApiResponse<CartItem>, { productId: string; quantity: number }, { rejectValue: string }>(
  "cart/add",
  async ({ productId, quantity }, { rejectWithValue }) => {
    try {
      const res = await cartAPI.addToCart(productId, quantity);
      return res.data;
    } catch (err: unknown) {
      const message =
        err && typeof err === "object" && "response" in err &&
        typeof (err as ApiError).response?.data?.message === "string"
          ? (err as ApiError).response.data.message
          : "Failed to add to cart";
      return rejectWithValue(message);
    }
  },
);

export const updateCartQuantity = createAsyncThunk<ApiResponse<CartItem>, { productId: string; quantity: number }, { rejectValue: string }>(
  "cart/updateQuantity",
  async ({ productId, quantity }, { rejectWithValue }) => {
    try {
      const res = await cartAPI.updateQuantity(productId, quantity);
      return res.data;
    } catch (err: unknown) {
      const message =
        err && typeof err === "object" && "response" in err &&
        typeof (err as ApiError).response?.data?.message === "string"
          ? (err as ApiError).response.data.message
          : "Failed to update cart quantity";
      return rejectWithValue(message);
    }
  },
);

export const removeFromCart = createAsyncThunk<string, string, { rejectValue: string }>(
  "cart/remove",
  async (productId, { rejectWithValue }) => {
    try {
      await cartAPI.removeItem(productId);
      return productId;
    } catch (err: unknown) {
      const message =
        err && typeof err === "object" && "response" in err &&
        typeof (err as ApiError).response?.data?.message === "string"
          ? (err as ApiError).response.data.message
          : "Failed to remove from cart";
      return rejectWithValue(message);
    }
  },
);

export const clearCart = createAsyncThunk<void, void, { rejectValue: string }>(
  "cart/clear",
  async (_, { rejectWithValue }) => {
    try {
      await cartAPI.clearCart();
    } catch (err: unknown) {
      const message =
        err && typeof err === "object" && "response" in err &&
        typeof (err as ApiError).response?.data?.message === "string"
          ? (err as ApiError).response.data.message
          : "Failed to clear cart";
      return rejectWithValue(message);
    }
  },
);