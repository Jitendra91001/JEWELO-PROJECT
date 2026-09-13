import { createSlice } from "@reduxjs/toolkit";
import {
  getDashboardStats,
  postProduct,
  updateProduct,
  getProductById,
  getCategories,
  createCategory,
  updateCategory,
  deleteCategory,
  toggleCategoryStatus,
  getOrders,
  updateOrderStatus,
  getUsers,
  updateUserRole,
  getRoles,
  toggleUserStatus,
  getCoupons,
  createCoupon,
  updateCoupon,
  deleteCoupon,
  getInventory,
  adjustInventory,
  getBanners,
  getAdminReviews,
  getAdminReturns,
} from "./adminThunk";

const initialState = {
  // Dashboard
  dashboard: null,

  // Products
  products: [] as any[],
  currentProduct: null as any,

  // Categories
  categories: [] as any[],

  // Orders
  orders: [] as any[],
  orderTotal: 0,
  orderPage: 1,
  orderLimit: 10,

  // Users
  users: [] as any[],
  userTotal: 0,
  userPage: 1,
  userLimit: 10,
  roles: [] as any[],

  // Coupons
  coupons: [] as any[],

  // Inventory
  inventory: [] as any[],

  // Banners
  banners: [] as any[],

  // Reviews
  reviews: [] as any[],

  // Returns
  returns: [] as any[],

  // Common
  loading: false,
  error: null as any,
};

const adminSlice = createSlice({
  name: "admin",
  initialState,
  reducers: {
    clearCurrentProduct: (state) => {
      state.currentProduct = null;
    },
    clearError: (state) => {
      state.error = null;
    },
    setOrderPagination: (state, action) => {
      state.orderPage = action.payload.page;
      state.orderLimit = action.payload.limit;
    },
    setUserPagination: (state, action) => {
      state.userPage = action.payload.page;
      state.userLimit = action.payload.limit;
    },
  },
  extraReducers: (builder) => {
    // Dashboard
    builder
      .addCase(getDashboardStats.pending, (state) => {
        state.loading = true;
      })
      .addCase(getDashboardStats.fulfilled, (state, action) => {
        state.loading = false;
        state.dashboard = action.payload;
      })
      .addCase(getDashboardStats.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });

    // Products
    builder
      .addCase(postProduct.pending, (state) => {
        state.loading = true;
      })
      .addCase(postProduct.fulfilled, (state, action) => {
        state.loading = false;
        state.products = [action.payload, ...state.products];
      })
      .addCase(postProduct.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(updateProduct.pending, (state) => {
        state.loading = true;
      })
      .addCase(updateProduct.fulfilled, (state, action) => {
        state.loading = false;
        const index = state.products.findIndex(p => p.id === action.payload.id);
        if (index !== -1) {
          state.products[index] = action.payload;
        }
      })
      .addCase(updateProduct.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(getProductById.fulfilled, (state, action) => {
        state.currentProduct = action.payload;
      });

    // Categories
    builder
      .addCase(getCategories.pending, (state) => {
        state.loading = true;
      })
      .addCase(getCategories.fulfilled, (state, action) => {
        state.loading = false;
        state.categories = (action.payload as any)?.data || action.payload;
      })
      .addCase(getCategories.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(createCategory.fulfilled, (state, action) => {
        state.categories = [action.payload, ...state.categories];
      })
      .addCase(updateCategory.fulfilled, (state, action) => {
        const index = state.categories.findIndex(c => c.id === action.payload.id);
        if (index !== -1) {
          state.categories[index] = action.payload;
        }
      })
      .addCase(deleteCategory.fulfilled, (state, action) => {
        state.categories = state.categories.filter(c => c.id !== action.payload);
      })
      .addCase(toggleCategoryStatus.fulfilled, (state, action) => {
        const index = state.categories.findIndex(c => c.id === action.payload.id);
        if (index !== -1) {
          state.categories[index] = action.payload;
        }
      });

    // Orders
    builder
      .addCase(getOrders.pending, (state) => {
        state.loading = true;
      })
      .addCase(getOrders.fulfilled, (state, action) => {
        state.loading = false;
        state.orders = action.payload.data;
        state.orderTotal = action.payload.pagination.total;
        state.orderPage = action.payload.pagination.page;
        state.orderLimit = action.payload.pagination.limit;
      })
      .addCase(getOrders.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(updateOrderStatus.fulfilled, (state, action) => {
        const index = state.orders.findIndex(o => o.id === action.payload.id);
        if (index !== -1) {
          state.orders[index] = action.payload;
        }
      });

    // Users
    builder
      .addCase(getUsers.pending, (state) => {
        state.loading = true;
      })
      .addCase(getUsers.fulfilled, (state, action) => {
        state.loading = false;
        state.users = action.payload.data;
        state.userTotal = action.payload.pagination.total;
        state.userPage = action.payload.pagination.page;
        state.userLimit = action.payload.pagination.limit;
      })
      .addCase(getUsers.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(updateUserRole.fulfilled, (state, action) => {
        const updated = action.payload.data;
        const index = state.users.findIndex(u => u.id === updated.id);
        if (index !== -1) {
          state.users[index] = {
            ...state.users[index],
            role: updated.role,
          };
        }
      })
      .addCase(getRoles.fulfilled, (state, action) => {
        state.roles = action.payload.roles || [];
      })
      .addCase(getRoles.rejected, (state, action) => {
        state.error = action.payload;
      })
      .addCase(toggleUserStatus.fulfilled, (state, action) => {
        const index = state.users.findIndex(u => u.id === action.payload.id);
        if (index !== -1) {
          state.users[index] = action.payload;
        }
      });

    // Coupons
    builder
      .addCase(getCoupons.pending, (state) => {
        state.loading = true;
      })
      .addCase(getCoupons.fulfilled, (state, action) => {
        state.loading = false;
        state.coupons = (action.payload as any)?.data || action.payload || [];
      })
      .addCase(getCoupons.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(createCoupon.fulfilled, (state, action) => {
        state.coupons = [action.payload, ...state.coupons];
      })
      .addCase(updateCoupon.fulfilled, (state, action) => {
        const index = state.coupons.findIndex(c => c.id === action.payload.id);
        if (index !== -1) {
          state.coupons[index] = action.payload;
        }
      })
      .addCase(deleteCoupon.fulfilled, (state, action) => {
        state.coupons = state.coupons.filter(c => c.id !== action.payload);
      })

      // Inventory
      .addCase(getInventory.pending, (state) => {
        state.loading = true;
      })
      .addCase(getInventory.fulfilled, (state, action) => {
        state.loading = false;
        state.inventory = action.payload?.data || [];
      })
      .addCase(getInventory.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Banners
      .addCase(getBanners.fulfilled, (state, action) => {
        state.banners = action.payload?.data || [];
      })

      // Reviews
      .addCase(getAdminReviews.fulfilled, (state, action) => {
        state.reviews = action.payload?.data || [];
      })

      // Returns
      .addCase(getAdminReturns.fulfilled, (state, action) => {
        state.returns = action.payload?.data || [];
      });
  },
});

export const { clearCurrentProduct, clearError, setOrderPagination, setUserPagination } = adminSlice.actions;
export default adminSlice.reducer;
