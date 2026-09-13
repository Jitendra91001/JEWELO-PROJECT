import { createSlice } from "@reduxjs/toolkit";
import { getWishlist, addToWishlist, removeFromWishlist } from "./wishlistThunk";

export interface WishlistItem {
  id: string;
  productId: string;
  name: string;
  price: number;
  discountPrice?: number;
  image: string;
  material?: string;
  rating?: number;
  addedAt?: string;
}

interface WishlistState {
  items: WishlistItem[];
  loading: boolean;
  error: string | null;
}

const initialState: WishlistState = {
  items: [],
  loading: false,
  error: null,
};

const wishlistSlice = createSlice({
  name: "wishlist",
  initialState,
  reducers: {
    clearWishlist: (state) => {
      state.items = [];
    },
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(getWishlist.pending, (state) => {
        state.loading = true;
      })
      .addCase(getWishlist.fulfilled, (state, action) => {
        state.loading = false;
        const raw = (action.payload as any)?.data || action.payload;
        const rawItems = Array.isArray(raw) ? raw : raw?.items || [];

        state.items = rawItems.map((item: any) => {
          const product = item.product || item;
          return {
            id: item._id || item.id || product._id || product.id,
            productId: product._id || product.id || item.productId,
            name: product.name || "Fine Jewellery Item",
            price: Number(product.price || 0),
            discountPrice: product.compareAtPrice || product.comparePrice,
            image: product.images?.[0] || product.thumbnail || item.image || "https://images.unsplash.com/photo-1605100804763-247f67b3557e",
            material: product.metal?.type || product.material || "Gold",
            rating: Number(product.averageRating || product.rating || 4.9),
            addedAt: item.createdAt || new Date().toISOString(),
          };
        });
        state.error = null;
      })
      .addCase(getWishlist.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Failed to fetch wishlist";
      })
      .addCase(addToWishlist.pending, (state) => {
        state.loading = true;
      })
      .addCase(addToWishlist.fulfilled, (state, action) => {
        state.loading = false;
        const payloadData = action.payload?.data || action.payload;
        const product = payloadData?.product || payloadData;
        const pId = product?._id || product?.id || action.meta?.arg;

        if (pId && !state.items.find((item) => item.productId === pId)) {
          state.items.push({
            id: payloadData?._id || pId,
            productId: pId,
            name: product?.name || "Fine Jewellery Item",
            price: Number(product?.price || 0),
            discountPrice: product?.compareAtPrice,
            image: product?.images?.[0] || product?.thumbnail || "https://images.unsplash.com/photo-1605100804763-247f67b3557e",
            material: product?.metal?.type || "Gold",
            rating: Number(product?.averageRating || 4.9),
            addedAt: new Date().toISOString(),
          });
        }
        state.error = null;
      })
      .addCase(addToWishlist.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Failed to add to wishlist";
      })
      .addCase(removeFromWishlist.pending, (state) => {
        state.loading = true;
      })
      .addCase(removeFromWishlist.fulfilled, (state, action) => {
        state.loading = false;
        state.items = state.items.filter(
          (item) => item.productId !== action.payload && item.id !== action.payload
        );
        state.error = null;
      })
      .addCase(removeFromWishlist.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Failed to remove from wishlist";
      });
  },
});

export const { clearWishlist, clearError } = wishlistSlice.actions;
export default wishlistSlice.reducer;
