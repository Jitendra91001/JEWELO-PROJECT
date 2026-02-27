import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export interface CartItem {
  id: string;
  productId: string;
  name: string;
  image: string;
  price: number;
  weight?: string;
  purity?: string;
  quantity: number;
}

interface CartState {
  items: CartItem[];
  loading: boolean;
}

const initialState: CartState = {
  items: JSON.parse(localStorage.getItem("cart") || "[]"),
  loading: false,
};

const saveCart = (items: CartItem[]) => {
  localStorage.setItem("cart", JSON.stringify(items));
};

const cartSlice = createSlice({
  name: "cart",
  initialState,
  reducers: {
    addToCart: (state, action: PayloadAction<CartItem>) => {
      const existing = state.items.find((i) => i.productId === action.payload.productId);
      if (existing) {
        existing.quantity += action.payload.quantity;
      } else {
        state.items.push(action.payload);
      }
      saveCart(state.items);
    },
    removeFromCart: (state, action: PayloadAction<string>) => {
      state.items = state.items.filter((i) => i.productId !== action.payload);
      saveCart(state.items);
    },
    updateQuantity: (state, action: PayloadAction<{ productId: string; quantity: number }>) => {
      const item = state.items.find((i) => i.productId === action.payload.productId);
      if (item) {
        item.quantity = Math.max(1, action.payload.quantity);
      }
      saveCart(state.items);
    },
    clearCart: (state) => {
      state.items = [];
      saveCart(state.items);
    },
  },
});

export const { addToCart, removeFromCart, updateQuantity, clearCart } = cartSlice.actions;
export default cartSlice.reducer;
