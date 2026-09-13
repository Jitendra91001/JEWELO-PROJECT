import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { getCart, addToCart, updateCartQuantity, removeFromCart, clearCart, applyCartCoupon, removeCartCoupon } from "./cartThunk";
import { mapBackendCartItem } from "@/utils/dataMappers";

export interface CartItem {
  id: string;
  _id?: string;
  productId: string;
  name: string;
  image: string;
  price: number;
  discountPrice?: number;
  weight?: string;
  purity?: string;
  quantity: number;
  ringSize?: number;
  size?: string | number;
  addedAt?: string;
  product?: any;
}

interface CartState {
  items: CartItem[];
  subtotal: number;
  discountAmount: number;
  taxAmount: number;
  totalAmount: number;
  couponCode?: string | null;
  loading: boolean;
  error: string | null;
}

const initialState: CartState = {
  items: [],
  subtotal: 0,
  discountAmount: 0,
  taxAmount: 0,
  totalAmount: 0,
  couponCode: null,
  loading: false,
  error: null,
};

const cartSlice = createSlice({
  name: "cart",
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    setCartFromLocal: (state, action: PayloadAction<CartItem[]>) => {
      state.items = action.payload;
    },
  },
  extraReducers: (builder) => {
    // 1. Get Cart
    builder
      .addCase(getCart.pending, (state) => {
        state.loading = true;
      })
      .addCase(getCart.fulfilled, (state, action: PayloadAction<any>) => {
        state.loading = false;
        const payloadData = action.payload?.data || action.payload;
        const rawItems = payloadData?.items ?? (Array.isArray(payloadData) ? payloadData : []);

        state.items = Array.isArray(rawItems) ? rawItems.map(mapBackendCartItem).filter(Boolean) : [];
        state.subtotal = Number(payloadData?.subtotal || 0);
        state.discountAmount = Number(payloadData?.discountAmount || 0);
        state.taxAmount = Number(payloadData?.taxAmount || 0);
        state.totalAmount = Number(payloadData?.totalAmount || 0);
        state.couponCode = payloadData?.couponCode || null;
        state.error = null;
      })
      .addCase(getCart.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Failed to fetch cart";
      })

      // 2. Add To Cart
      .addCase(addToCart.pending, (state) => {
        state.loading = true;
      })
      .addCase(addToCart.fulfilled, (state, action: PayloadAction<any>) => {
        state.loading = false;
        const payloadData = action.payload?.data || action.payload;

        // If backend returned full updated cart
        if (payloadData?.items && Array.isArray(payloadData.items)) {
          state.items = payloadData.items.map(mapBackendCartItem).filter(Boolean);
          state.subtotal = Number(payloadData.subtotal || 0);
          state.discountAmount = Number(payloadData.discountAmount || 0);
          state.taxAmount = Number(payloadData.taxAmount || 0);
          state.totalAmount = Number(payloadData.totalAmount || 0);
        } else {
          // Fallback single item addition
          const newItem = mapBackendCartItem(payloadData);
          if (newItem) {
            const idx = state.items.findIndex((i) => i.productId === newItem.productId);
            if (idx >= 0) {
              state.items[idx].quantity += newItem.quantity;
            } else {
              state.items.push(newItem);
            }
          }
        }
        state.error = null;
      })
      .addCase(addToCart.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Failed to add to cart";
      })

      // 3. Update Cart Quantity
      .addCase(updateCartQuantity.pending, (state) => {
        state.loading = true;
      })
      .addCase(updateCartQuantity.fulfilled, (state, action: PayloadAction<any>) => {
        state.loading = false;
        const payloadData = action.payload?.data || action.payload;

        if (payloadData?.items && Array.isArray(payloadData.items)) {
          state.items = payloadData.items.map(mapBackendCartItem).filter(Boolean);
          state.subtotal = Number(payloadData.subtotal || 0);
          state.discountAmount = Number(payloadData.discountAmount || 0);
          state.taxAmount = Number(payloadData.taxAmount || 0);
          state.totalAmount = Number(payloadData.totalAmount || 0);
        }
        state.error = null;
      })
      .addCase(updateCartQuantity.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Failed to update cart quantity";
      })

      // 4. Remove From Cart
      .addCase(removeFromCart.pending, (state) => {
        state.loading = true;
      })
      .addCase(removeFromCart.fulfilled, (state, action: PayloadAction<any>) => {
        state.loading = false;
        const payloadData = action.payload?.data || action.payload;
        if (payloadData?.items && Array.isArray(payloadData.items)) {
          state.items = payloadData.items.map(mapBackendCartItem).filter(Boolean);
          state.subtotal = Number(payloadData.subtotal || 0);
          state.discountAmount = Number(payloadData.discountAmount || 0);
          state.taxAmount = Number(payloadData.taxAmount || 0);
          state.totalAmount = Number(payloadData.totalAmount || 0);
        } else {
          state.items = state.items.filter((i) => i.productId !== action.payload && i.id !== action.payload);
        }
        state.error = null;
      })
      .addCase(removeFromCart.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Failed to remove from cart";
      })

      // 5. Clear Cart
      .addCase(clearCart.fulfilled, (state) => {
        state.loading = false;
        state.items = [];
        state.subtotal = 0;
        state.discountAmount = 0;
        state.taxAmount = 0;
        state.totalAmount = 0;
        state.couponCode = null;
        state.error = null;
      })

      // 6. Apply Coupon
      .addCase(applyCartCoupon.fulfilled, (state, action: PayloadAction<any>) => {
        const payloadData = action.payload?.data || action.payload;
        if (payloadData?.items && Array.isArray(payloadData.items)) {
          state.items = payloadData.items.map(mapBackendCartItem).filter(Boolean);
          state.subtotal = Number(payloadData.subtotal || 0);
          state.discountAmount = Number(payloadData.discountAmount || 0);
          state.taxAmount = Number(payloadData.taxAmount || 0);
          state.totalAmount = Number(payloadData.totalAmount || 0);
          state.couponCode = payloadData.couponCode || null;
        }
        state.error = null;
      })
      .addCase(applyCartCoupon.rejected, (state, action) => {
        state.error = action.payload || "Failed to apply coupon";
      })

      // 7. Remove Coupon
      .addCase(removeCartCoupon.fulfilled, (state, action: PayloadAction<any>) => {
        const payloadData = action.payload?.data || action.payload;
        if (payloadData?.items && Array.isArray(payloadData.items)) {
          state.items = payloadData.items.map(mapBackendCartItem).filter(Boolean);
          state.subtotal = Number(payloadData.subtotal || 0);
          state.discountAmount = Number(payloadData.discountAmount || 0);
          state.taxAmount = Number(payloadData.taxAmount || 0);
          state.totalAmount = Number(payloadData.totalAmount || 0);
          state.couponCode = null;
        }
        state.error = null;
      });
  },
});

export const { clearError, setCartFromLocal } = cartSlice.actions;
export default cartSlice.reducer;
