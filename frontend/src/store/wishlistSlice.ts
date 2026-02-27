import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export interface WishlistItem {
  id: string;
  name: string;
  price: number;
  originalPrice?: number;
  image: string;
  material?: string;
  rating?: number;
}

interface WishlistState {
  items: WishlistItem[];
}

const initialState: WishlistState = {
  items: JSON.parse(localStorage.getItem("wishlist") || "[]"),
};

const saveWishlist = (items: WishlistItem[]) => {
  localStorage.setItem("wishlist", JSON.stringify(items));
};

const wishlistSlice = createSlice({
  name: "wishlist",
  initialState,
  reducers: {
    toggleWishlist: (state, action: PayloadAction<WishlistItem>) => {
      const exists = state.items.find((i) => i.id === action.payload.id);
      if (exists) {
        state.items = state.items.filter((i) => i.id !== action.payload.id);
      } else {
        state.items.push(action.payload);
      }
      saveWishlist(state.items);
    },
    removeFromWishlist: (state, action: PayloadAction<string>) => {
      state.items = state.items.filter((i) => i.id !== action.payload);
      saveWishlist(state.items);
    },
    clearWishlist: (state) => {
      state.items = [];
      saveWishlist(state.items);
    },
  },
});

export const { toggleWishlist, removeFromWishlist, clearWishlist } = wishlistSlice.actions;
export default wishlistSlice.reducer;
