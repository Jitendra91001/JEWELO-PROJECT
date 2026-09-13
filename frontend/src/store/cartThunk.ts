import { cartAPI } from "@/api/cart.api";
import axiosInstance from "@/api/axiosInstance";
import { createAsyncThunk } from "@reduxjs/toolkit";

interface ApiError {
  response?: { data?: { message?: string } };
}

export const getCart = createAsyncThunk<any, void, { rejectValue: string }>(
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
  }
);

export const addToCart = createAsyncThunk<any, { productId: string; quantity?: number; ringSize?: number }, { rejectValue: string }>(
  "cart/add",
  async ({ productId, quantity = 1, ringSize }, { rejectWithValue }) => {
    try {
      const res = await axiosInstance.post("/api/v1/cart", { productId, quantity, selectedSize: ringSize });
      return res.data;
    } catch (err: unknown) {
      const message =
        err && typeof err === "object" && "response" in err &&
        typeof (err as ApiError).response?.data?.message === "string"
          ? (err as ApiError).response.data.message
          : "Failed to add to cart";
      return rejectWithValue(message);
    }
  }
);

export const updateCartQuantity = createAsyncThunk<any, { productId: string; quantity: number }, { rejectValue: string }>(
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
  }
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
  }
);

export const applyCartCoupon = createAsyncThunk<any, string, { rejectValue: string }>(
  "cart/applyCoupon",
  async (code, { rejectWithValue }) => {
    try {
      const res = await axiosInstance.post("/api/v1/cart/apply-coupon", { code });
      return res.data;
    } catch (err: unknown) {
      const message =
        err && typeof err === "object" && "response" in err &&
        typeof (err as ApiError).response?.data?.message === "string"
          ? (err as ApiError).response.data.message
          : "Failed to apply coupon";
      return rejectWithValue(message);
    }
  }
);

export const removeCartCoupon = createAsyncThunk<any, void, { rejectValue: string }>(
  "cart/removeCoupon",
  async (_, { rejectWithValue }) => {
    try {
      const res = await axiosInstance.delete("/api/v1/cart/coupon");
      return res.data;
    } catch (err: unknown) {
      return rejectWithValue("Failed to remove coupon");
    }
  }
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
  }
);