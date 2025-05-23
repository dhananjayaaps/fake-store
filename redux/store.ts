import { configureStore } from "@reduxjs/toolkit";
import cartReducer from "./slices/cartSlices";
import authReducer from "./slices/authSlice";
import ordersReducer from "./slices/orderSlice";

export const store = configureStore({
  reducer: {
    cart: cartReducer,
    auth: authReducer,
    orders: ordersReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
