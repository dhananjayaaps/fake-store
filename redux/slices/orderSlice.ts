import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export type OrderStatus = "new" | "paid" | "delivered";

export type Product = {
  id: string;
  title: string;
  image: string;
  price: number;
  quantity: number;
};

export type Order = {
  id: string;
  status: OrderStatus;
  total: number;
  items: Product[];
};

interface OrdersState {
  items: Order[];
  newOrderCount: number;
}

const initialState: OrdersState = {
  items: [],
  newOrderCount: 0,
};

const ordersSlice = createSlice({
  name: "orders",
  initialState,
  reducers: {
    // Add a new order
    addOrder: (state, action: PayloadAction<{ items: Product[] }>) => {
      const newOrder: Order = {
        id: Date.now().toString(), // or use uuid()
        status: "new",
        total: action.payload.items.reduce(
          (sum, item) => sum + item.price * item.quantity,
          0
        ),
        items: action.payload.items,
      };
      state.items.unshift(newOrder);
      state.newOrderCount += 1;
    },

    // Reset new order badge count
    markAllOrdersAsSeen: (state) => {
      state.newOrderCount = 0;
    },

    // Update the status of an order
    updateOrderStatus: (
      state,
      action: PayloadAction<{ id: string; status: OrderStatus }>
    ) => {
      const order = state.items.find((o) => o.id === action.payload.id);
      if (order) {
        order.status = action.payload.status;
      }
    },

    // Clear all orders
    clearOrders: (state) => {
      state.items = [];
      state.newOrderCount = 0;
    },
  },
});

export const {
  addOrder,
  markAllOrdersAsSeen,
  updateOrderStatus,
  clearOrders,
} = ordersSlice.actions;

export default ordersSlice.reducer;
