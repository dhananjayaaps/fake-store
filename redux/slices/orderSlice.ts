import { createSlice, PayloadAction } from "@reduxjs/toolkit";

type Product = {
  id: string;
  title: string;
  image: string;
  price: number;
  quantity: number;
};

type Order = {
  id: string;
  status: "new" | "paid" | "delivered";
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
    addOrder: (state, action: PayloadAction<{ items: Product[] }>) => {
      const newOrder: Order = {
        id: Date.now().toString(), // or use uuid
        status: "new",
        total: action.payload.items.reduce(
          (sum, item) => sum + item.price * item.quantity,
          0
        ),
        items: action.payload.items,
      };
      state.items.unshift(newOrder); // Add to top
      state.newOrderCount += 1;
    },

    markAllOrdersAsSeen: (state) => {
      state.newOrderCount = 0;
    },

    updateOrderStatus: (
      state,
      action: PayloadAction<{ id: string; status: "paid" | "delivered" }>
    ) => {
      const order = state.items.find((o) => o.id === action.payload.id);
      if (order) {
        order.status = action.payload.status;
      }
    },

    clearOrders: (state) => {
      state.items = [];
      state.newOrderCount = 0;
    },
  },
});

export const { addOrder, markAllOrdersAsSeen, updateOrderStatus, clearOrders } =
  ordersSlice.actions;

export default ordersSlice.reducer;
