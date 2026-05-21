import { createSlice } from "@reduxjs/toolkit";
import { getCart, addToCart, updateCartQuantity, removeFromCart, clearCart } from "./cartThunk";

export interface CartItem {
  id: string;
  productId: string;
  name: string;
  image: string;
  price: number;
  discountPrice?: number;
  weight?: string;
  purity?: string;
  quantity: number;
  addedAt?: string;
  product?: {
    id: string;
    name?: string;
    thumbnail?: string;
    price?: number;
    discountPrice?: number;
  };
}

interface CartState {
  items: CartItem[];
  loading: boolean;
  error: string | null;
}

const initialState: CartState = {
  items: [],
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
  },
  extraReducers: (builder) => {
    builder
      .addCase(getCart.pending, (state) => {
        state.loading = true;
      })
      .addCase(getCart.fulfilled, (state, action) => {
        state.loading = false;
        const payloadData = action.payload?.data;
        const cartItems =
          payloadData?.items ??
          (Array.isArray(payloadData) ? payloadData : undefined);

        state.items = Array.isArray(cartItems) ? cartItems : [];
        state.error = null;
      })
      .addCase(getCart.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Failed to fetch cart";
      })
      .addCase(addToCart.pending, (state) => {
        state.loading = true;
      })
      .addCase(addToCart.fulfilled, (state, action) => {
        state.loading = false;
        // Add the new item to the cart
        const newItem = action.payload?.data;
        if (newItem) {
          const existingIndex = state.items.findIndex(item => item.id === newItem.id);
          if (existingIndex >= 0) {
            state.items[existingIndex] = newItem;
          } else {
            state.items.push(newItem);
          }
        }
        state.error = null;
      })
      .addCase(addToCart.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Failed to add to cart";
      })
      .addCase(updateCartQuantity.pending, (state) => {
        state.loading = true;
      })
      .addCase(updateCartQuantity.fulfilled, (state, action) => {
        state.loading = false;
        // Update the specific item in the cart
        const updatedItem = action.payload?.data;
        if (updatedItem) {
          state.items = state.items.map(item => item.id === updatedItem.id ? updatedItem : item);
        }
        state.error = null;
      })
      .addCase(updateCartQuantity.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Failed to update cart quantity";
      })
      .addCase(removeFromCart.pending, (state) => {
        state.loading = true;
      })
      .addCase(removeFromCart.fulfilled, (state, action) => {
        state.loading = false;
        state.items = state.items.filter(item => item.productId !== action.payload);
        state.error = null;
      })
      .addCase(removeFromCart.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Failed to remove from cart";
      })
      .addCase(clearCart.pending, (state) => {
        state.loading = true;
      })
      .addCase(clearCart.fulfilled, (state) => {
        state.loading = false;
        state.items = [];
        state.error = null;
      })
      .addCase(clearCart.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Failed to clear cart";
      });
  },
});

export const { clearError } = cartSlice.actions;
export default cartSlice.reducer;
