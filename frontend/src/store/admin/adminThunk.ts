import { adminAPI } from "@/api/admin.api";
import { createAsyncThunk } from "@reduxjs/toolkit";
import type { Product } from "@/store/productSlice";

interface UpdateProductPayload {
  id: string;
  data: FormData;
}

interface ApiError {
  response?: { data?: { message?: string } };
}

export const getDashboardStats = createAsyncThunk<any, void, { rejectValue: string }>(
  "admin/dashboard",
  async (_, { rejectWithValue }) => {
    try {
      const res = await adminAPI.getDashboard();
      return res.data;
    } catch (err: unknown) {
      const message =
        err && typeof err === "object" && "response" in err &&
        typeof (err as ApiError).response?.data?.message === "string"
          ? (err as ApiError).response.data.message
          : "Failed to fetch dashboard stats";
      return rejectWithValue(message);
    }
  },
);

export const postProduct = createAsyncThunk<Product, FormData, { rejectValue: string }>(
  "products/create",
  async (data, { rejectWithValue }) => {
    try {
      const res = await adminAPI.createProduct(data);
      return res.data;
    } catch (err: unknown) {
      const message =
        err && typeof err === "object" && "response" in err &&
        typeof (err as ApiError).response?.data?.message === "string"
          ? (err as ApiError).response.data.message
          : "Failed to fetch products";
      return rejectWithValue(message);
    }
  },
);

export const updateProduct = createAsyncThunk<
  Product,
  UpdateProductPayload,
  { rejectValue: string }
>("products/update", async ({ id, data }, { rejectWithValue }) => {
  try {
    const res = await adminAPI.updateProduct(id, data);
    return res.data;
  } catch (err: unknown) {
    const message =
      err && typeof err === "object" && "response" in err &&
      typeof (err as ApiError).response?.data?.message === "string"
        ? (err as ApiError).response.data.message
        : "Failed to update product";
    return rejectWithValue(message);
  }
});

export const getProductById = createAsyncThunk<Product, string, { rejectValue: string }>(
  "products/byid",
  async (id, { rejectWithValue }) => {
  try {
    const res = await adminAPI.getProductsById(id);
    return res.data;
  } catch (err: unknown) {
    const message =
      err && typeof err === "object" && "response" in err &&
      typeof (err as ApiError).response?.data?.message === "string"
        ? (err as ApiError).response.data.message
        : "Failed to update product";
    return rejectWithValue(message);
  }
});

// Categories
export const getCategories = createAsyncThunk<any[], void, { rejectValue: string }>(
  "admin/categories",
  async (_, { rejectWithValue }) => {
    try {
      const res = await adminAPI.getCategories();
      return res.data;
    } catch (err: unknown) {
      const message =
        err && typeof err === "object" && "response" in err &&
        typeof (err as ApiError).response?.data?.message === "string"
          ? (err as ApiError).response.data.message
          : "Failed to fetch categories";
      return rejectWithValue(message);
    }
  },
);

export const createCategory = createAsyncThunk<any, FormData, { rejectValue: string }>(
  "admin/createCategory",
  async (data, { rejectWithValue }) => {
    try {
      const res = await adminAPI.createCategory(data);
      return res.data;
    } catch (err: unknown) {
      const message =
        err && typeof err === "object" && "response" in err &&
        typeof (err as ApiError).response?.data?.message === "string"
          ? (err as ApiError).response.data.message
          : "Failed to create category";
      return rejectWithValue(message);
    }
  },
);

export const updateCategory = createAsyncThunk<any, { id: string; data: FormData }, { rejectValue: string }>(
  "admin/updateCategory",
  async ({ id, data }, { rejectWithValue }) => {
    try {
      const res = await adminAPI.updateCategory(id, data);
      return res.data;
    } catch (err: unknown) {
      const message =
        err && typeof err === "object" && "response" in err &&
        typeof (err as ApiError).response?.data?.message === "string"
          ? (err as ApiError).response.data.message
          : "Failed to update category";
      return rejectWithValue(message);
    }
  },
);

export const deleteCategory = createAsyncThunk<string, string, { rejectValue: string }>(
  "admin/deleteCategory",
  async (id, { rejectWithValue }) => {
    try {
      await adminAPI.deleteCategory(id);
      return id;
    } catch (err: unknown) {
      const message =
        err && typeof err === "object" && "response" in err &&
        typeof (err as ApiError).response?.data?.message === "string"
          ? (err as ApiError).response.data.message
          : "Failed to delete category";
      return rejectWithValue(message);
    }
  },
);

// Orders
export const getOrders = createAsyncThunk<any, any, { rejectValue: string }>(
  "admin/orders",
  async (params, { rejectWithValue }) => {
    try {
      const res = await adminAPI.getOrders(params);
      return res.data;
    } catch (err: unknown) {
      const message =
        err && typeof err === "object" && "response" in err &&
        typeof (err as ApiError).response?.data?.message === "string"
          ? (err as ApiError).response.data.message
          : "Failed to fetch orders";
      return rejectWithValue(message);
    }
  },
);

export const updateOrderStatus = createAsyncThunk<any, { id: string; status: string }, { rejectValue: string }>(
  "admin/updateOrderStatus",
  async ({ id, status }, { rejectWithValue }) => {
    try {
      const res = await adminAPI.updateOrderStatus(id, status);
      return res.data;
    } catch (err: unknown) {
      const message =
        err && typeof err === "object" && "response" in err &&
        typeof (err as ApiError).response?.data?.message === "string"
          ? (err as ApiError).response.data.message
          : "Failed to update order status";
      return rejectWithValue(message);
    }
  },
);

// Users
export const getUsers = createAsyncThunk<any, any, { rejectValue: string }>(
  "admin/users",
  async (params, { rejectWithValue }) => {
    try {
      const res = await adminAPI.getUsers(params);
      return res.data;
    } catch (err: unknown) {
      const message =
        err && typeof err === "object" && "response" in err &&
        typeof (err as ApiError).response?.data?.message === "string"
          ? (err as ApiError).response.data.message
          : "Failed to fetch users";
      return rejectWithValue(message);
    }
  },
);

export const toggleUserStatus = createAsyncThunk<any, string, { rejectValue: string }>(
  "admin/toggleUserStatus",
  async (id, { rejectWithValue }) => {
    try {
      const res = await adminAPI.toggleUserStatus(id);
      return res.data;
    } catch (err: unknown) {
      const message =
        err && typeof err === "object" && "response" in err &&
        typeof (err as ApiError).response?.data?.message === "string"
          ? (err as ApiError).response.data.message
          : "Failed to toggle user status";
      return rejectWithValue(message);
    }
  },
);

// Coupons
export const getCoupons = createAsyncThunk<any[], void, { rejectValue: string }>(
  "admin/coupons",
  async (_, { rejectWithValue }) => {
    try {
      const res = await adminAPI.getCoupons();
      return res.data;
    } catch (err: unknown) {
      const message =
        err && typeof err === "object" && "response" in err &&
        typeof (err as ApiError).response?.data?.message === "string"
          ? (err as ApiError).response.data.message
          : "Failed to fetch coupons";
      return rejectWithValue(message);
    }
  },
);

export const createCoupon = createAsyncThunk<any, any, { rejectValue: string }>(
  "admin/createCoupon",
  async (data, { rejectWithValue }) => {
    try {
      const res = await adminAPI.createCoupon(data);
      return res.data;
    } catch (err: unknown) {
      const message =
        err && typeof err === "object" && "response" in err &&
        typeof (err as ApiError).response?.data?.message === "string"
          ? (err as ApiError).response.data.message
          : "Failed to create coupon";
      return rejectWithValue(message);
    }
  },
);

export const updateCoupon = createAsyncThunk<any, { id: string; data: any }, { rejectValue: string }>(
  "admin/updateCoupon",
  async ({ id, data }, { rejectWithValue }) => {
    try {
      const res = await adminAPI.updateCoupon(id, data);
      return res.data;
    } catch (err: unknown) {
      const message =
        err && typeof err === "object" && "response" in err &&
        typeof (err as ApiError).response?.data?.message === "string"
          ? (err as ApiError).response.data.message
          : "Failed to update coupon";
      return rejectWithValue(message);
    }
  },
);

export const deleteCoupon = createAsyncThunk<string, string, { rejectValue: string }>(
  "admin/deleteCoupon",
  async (id, { rejectWithValue }) => {
    try {
      await adminAPI.deleteCoupon(id);
      return id;
    } catch (err: unknown) {
      const message =
        err && typeof err === "object" && "response" in err &&
        typeof (err as ApiError).response?.data?.message === "string"
          ? (err as ApiError).response.data.message
          : "Failed to delete coupon";
      return rejectWithValue(message);
    }
  },
);
