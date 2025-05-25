import AsyncStorage from "@react-native-async-storage/async-storage";
import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import axios from "axios";

// Interfaces
interface Product {
  id: string | number;
  title: string;
  price: number;
  image: string;
  description?: string;
  category?: string;
}

interface CartItem {
  id: string;
  product: Product;
  quantity: number;
}

interface CartState {
  items: CartItem[];
  status: 'idle' | 'loading' | 'succeeded' | 'failed';
  error: string | null;
}

// Initial State
const initialState: CartState = {
  items: [],
  status: 'idle',
  error: null,
};

// Async Thunks
export const fetchCart = createAsyncThunk('cart/fetchCart', async () => {
  const token = await AsyncStorage.getItem("userToken");
  const response = await axios.get('http://10.0.2.2:4001/carts/user', {
    headers: { Authorization: `Bearer ${token}` },
  });
  return response.data;
});

export const updateCartItem = createAsyncThunk(
  'cart/updateCartItem',
  async ({ itemId, quantity }: { itemId: string; quantity: number }, { getState }) => {
    const state = getState() as { cart: CartState };
    const token = await AsyncStorage.getItem("userToken");
    const item = state.cart.items.find(i => i.id === itemId);

    if (!item) throw new Error('Item not found in cart');

    const response = await axios.put(
      `http://10.0.2.2:4001/carts/items/${item.product.id}`,
      { quantity },
      { headers: { Authorization: `Bearer ${token}` } }
    );

    return response.data;
  }
);

export const syncCart = createAsyncThunk('cart/syncCart', async (_, { getState }) => {
  const state = getState() as { cart: CartState };
  const token = await AsyncStorage.getItem("userToken");

  const response = await axios.post(
    'http://10.0.2.2:4001/carts',
    {
      products: state.cart.items.map(item => ({
        product: {
          id: item.product.id,
          title: item.product.title,
          price: item.product.price,
          image: item.product.image,
          description: item.product.description || "",
          category: item.product.category || "",
        },
        quantity: item.quantity,
      })),
    },
    {
      headers: { Authorization: `Bearer ${token}` },
    }
  );

  return response.data;
});

// Slice
const cartSlice = createSlice({
  name: "cart",
  initialState,
  reducers: {
    addToCart: (state, action: PayloadAction<Product>) => {
      const existingIndex = state.items.findIndex(
        item => item.product.id === action.payload.id
      );

      if (existingIndex >= 0) {
        state.items[existingIndex].quantity += 1;
      } else {
        state.items.push({
          id: Date.now().toString(),
          product: action.payload,
          quantity: 1,
        });
      }
    },
    incrementQuantity: (state, action: PayloadAction<string>) => {
      const item = state.items.find(i => i.id === action.payload);
      if (item) item.quantity += 1;
    },
    decrementQuantity: (state, action: PayloadAction<string>) => {
      const itemIndex = state.items.findIndex(i => i.id === action.payload);
      if (itemIndex >= 0) {
        if (state.items[itemIndex].quantity > 1) {
          state.items[itemIndex].quantity -= 1;
        } else {
          state.items.splice(itemIndex, 1);
        }
      }
    },
    clearCart: (state) => {
      state.items = [];
    },
  },
  extraReducers: (builder) => {
  builder
    .addCase(fetchCart.pending, (state) => {
      state.status = 'loading';
    })
    .addCase(fetchCart.fulfilled, (state, action) => {
      state.status = 'succeeded';
      state.items = action.payload.products.map((item: any) => ({
        id: item.id || item.productId, // Fix: fallback to `id` if available
        product: {
          id: item.product?.id ?? item.productId,
          title: item.product?.title ?? item.title,
          price: item.product?.price ?? item.price,
          image: item.product?.image ?? item.image,
          description: item.product?.description ?? item.description ?? "",
          category: item.product?.category ?? item.category ?? "",
        },
        quantity: item.quantity,
      }));
    })
    .addCase(fetchCart.rejected, (state, action) => {
      state.status = 'failed';
      state.error = action.error.message || 'Failed to fetch cart';
    })

    .addCase(updateCartItem.fulfilled, (state, action) => {
      state.status = 'succeeded';
      state.items = action.payload.products.map((item: any) => ({
        id: item.id || item.productId,
        product: {
          id: item.product?.id ?? item.productId,
          title: item.product?.title ?? item.title,
          price: item.product?.price ?? item.price,
          image: item.product?.image ?? item.image,
          description: item.product?.description ?? item.description ?? "",
          category: item.product?.category ?? item.category ?? "",
        },
        quantity: item.quantity,
      }));
    })
    .addCase(updateCartItem.rejected, (state, action) => {
      state.status = 'failed';
      state.error = action.error.message || 'Failed to update item quantity';
    })

    .addCase(syncCart.pending, (state) => {
      state.status = 'loading';
    })
    .addCase(syncCart.fulfilled, (state, action) => {
      state.status = 'succeeded';
      state.items = action.payload.products.map((item: any) => ({
        id: item.id || item.productId,
        product: {
          id: item.product?.id ?? item.productId,
          title: item.product?.title ?? item.title,
          price: item.product?.price ?? item.price,
          image: item.product?.image ?? item.image,
          description: item.product?.description ?? item.description ?? "",
          category: item.product?.category ?? item.category ?? "",
        },
        quantity: item.quantity,
      }));
    })
    .addCase(syncCart.rejected, (state, action) => {
      state.status = 'failed';
      state.error = action.error.message || 'Failed to sync cart';
    });
}});

// Exports
export const {
  addToCart,
  incrementQuantity,
  decrementQuantity,
  clearCart,
} = cartSlice.actions;

export default cartSlice.reducer;