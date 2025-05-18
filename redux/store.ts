import { configureStore } from "@reduxjs/toolkit";
import cartReducer from "./slices/cartSlices";
import authReducer from "./slices/authSlice"; // ✅ Import the auth slice

export const store = configureStore({
  reducer: {
    cart: cartReducer,
    auth: authReducer, // ✅ Add the auth reducer to the store
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
