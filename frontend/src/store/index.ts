import { combineReducers, configureStore } from "@reduxjs/toolkit";
import { persistStore, persistReducer } from "redux-persist";
import storage from "redux-persist/lib/storage";
import authReducer, { logout } from "./authSlice";
import cartReducer from "./cartSlice";
import productReducer from "./productSlice";
import wishlistReducer from "./wishlistSlice";
import feedbackReducer from "./feedbackSlice";
import adminProductSlice from "./admin/adminSlice";
import commonReducer from "./common/commonSlice";

const persistConfig = {
  key: "root",
  storage,
  whitelist: ["auth", "cart"],
};

const appReducer = combineReducers({
  auth: authReducer,
  cart: cartReducer,
  products: productReducer,
  admin: adminProductSlice,
  wishlist: wishlistReducer,
  feedback: feedbackReducer,
  commonSlice: commonReducer,
});

const rootReducer = (state: ReturnType<typeof appReducer> | undefined, action: { type: string }) => {
  if (action.type === logout.type) {
    storage.removeItem("persist:root");
    return appReducer(undefined, action);
  }
  return appReducer(state, action);
};

// Create the persisted reducer
const persistedReducer = persistReducer(persistConfig, rootReducer);

export const store = configureStore({
  reducer: persistedReducer,
});

export const persistor = persistStore(store);
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
