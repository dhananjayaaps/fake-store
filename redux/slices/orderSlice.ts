import AsyncStorage from "@react-native-async-storage/async-storage";
import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import axios from "axios";

export type OrderStatus = "new" | "paid" | "delivered" | "cancelled";

export type Product = {
  _id: string;
  title: string;
  image: string;
  price: number;
  quantity: number;
};

export type Order = {
  _id: string;
  status: OrderStatus;
  total: number;
  items: Product[];
  createdAt?: string;
  updatedAt?: string;
};

interface OrdersState {
  items: Order[];
  newOrderCount: number;
  status: 'idle' | 'loading' | 'succeeded' | 'failed';
  error: string | null;
}

const initialState: OrdersState = {
  items: [],
  newOrderCount: 0,
  status: 'idle',
  error: null,
};

export const createOrder = createAsyncThunk(
  'orders/createOrder',
  async (products: Product[], { rejectWithValue }) => {
    try {
      const token = await AsyncStorage.getItem("userToken");

      const response = await axios.post(
        'http://10.0.2.2:4001/orders',
        {
          items: products,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);

export const fetchUserOrders = createAsyncThunk(
  'orders/fetchUserOrders',
  async (_, { rejectWithValue }) => {
    try {
      const token = await AsyncStorage.getItem("userToken");
      const response = await axios.get('http://10.0.2.2:4001/orders', {
        headers: { Authorization: `Bearer ${token}` }
      });
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);

export const updateOrder = createAsyncThunk(
  'orders/updateOrder',
  async ({ id, status }: { id: string; status: OrderStatus }, { rejectWithValue }) => {
    try {
      const token = await AsyncStorage.getItem("userToken");
      const response = await axios.patch(
        `http://10.0.2.2:4001/orders/${id}/status`,
        { status },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);

const ordersSlice = createSlice({
  name: "orders",
  initialState,
  reducers: {
    // Add a new order (for local state management)
    addOrder: (state, action: PayloadAction<{ items: Product[] }>) => {
      const newOrder: Order = {
        _id: Date.now().toString(),
        status: "new",
        total: action.payload.items.reduce(
          (sum, item) => sum + item.price * item.quantity,
          0
        ),
        items: action.payload.items,
        createdAt: new Date().toISOString(),
      };
      state.items.unshift(newOrder);
      state.newOrderCount += 1;
    },

    // Reset new order badge count
    markAllOrdersAsSeen: (state) => {
      state.newOrderCount = 0;
    },

    // Clear all orders (for logout or account switch)
    clearOrders: (state) => {
      state.items = [];
      state.newOrderCount = 0;
      state.status = 'idle';
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Create Order
      .addCase(createOrder.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(createOrder.fulfilled, (state, action: PayloadAction<Order>) => {
        state.status = 'succeeded';
        const newOrder = action.payload;

        // Optional: check if order already exists by _id to avoid duplication
        const existingIndex = state.items.findIndex(order => order._id === newOrder._id);
        if (existingIndex === -1) {
          state.items.unshift(newOrder);
          state.newOrderCount += 1;
        }
      })
      .addCase(createOrder.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload as string || 'Failed to create order';
      })

      // Fetch Orders
      .addCase(fetchUserOrders.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchUserOrders.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.items = action.payload;
      })
      .addCase(fetchUserOrders.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload as string || 'Failed to fetch orders';
      })

      // Update Order
      .addCase(updateOrder.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(updateOrder.fulfilled, (state, action) => {
        state.status = 'succeeded';
        const index = state.items.findIndex(order => order._id === action.payload._id);
        if (index !== -1) {
          state.items[index] = action.payload;
        }
      })
      .addCase(updateOrder.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload as string || 'Failed to update order';
      });
  }
});

export const {
  addOrder,
  markAllOrdersAsSeen,
  clearOrders,
} = ordersSlice.actions;

export default ordersSlice.reducer;