import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';

interface AuthState {
  isAuthenticated: boolean;
  user: any | null;
  token: string | null;
  status: 'idle' | 'loading' | 'succeeded' | 'failed';
  error: string | null;
}

const initialState: AuthState = {
  isAuthenticated: false,
  user: null,
  token: null,
  status: 'idle',
  error: null
};

// Async thunk to check authentication status
export const checkAuthStatus = createAsyncThunk(
  'auth/checkAuthStatus',
  async () => {
    try {
      // Get token from AsyncStorage
      const token = await AsyncStorage.getItem('userToken');
      
      if (!token) {
        return { isAuthenticated: false, user: null, token: null };
      }

      // Verify token with your backend
      const response = await axios.get('http://10.0.2.2:4001/auth/verify', {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      if (response.data.valid) {
        // Optionally get user data if needed
        const userResponse = await axios.get('http://10.0.2.2:4001/users/profile', {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });

        return {
          isAuthenticated: true,
          user: userResponse.data,
          token: token
        };
      } else {
        await AsyncStorage.removeItem('userToken');
        return { isAuthenticated: false, user: null, token: null };
      }
    } catch (error) {
      await AsyncStorage.removeItem('userToken');
      return { isAuthenticated: false, user: null, token: null };
    }
  }
);

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    login(state, action) {
      state.isAuthenticated = true;
      state.user = action.payload.user;
      state.token = action.payload.token;
      state.status = 'succeeded';
      state.error = null;
    },
    setAuthenticated: (state, action) => {
      state.isAuthenticated = action.payload;
    },
    setUser: (state, action) => {
      state.user = action.payload;
      if (action.payload) {
        state.isAuthenticated = true;
      }
    },
    logout(state) {
      state.isAuthenticated = false;
      state.user = null;
      state.token = null;
      state.status = 'idle';
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(checkAuthStatus.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(checkAuthStatus.fulfilled, (state, action) => {
        state.isAuthenticated = action.payload.isAuthenticated;
        state.user = action.payload.user;
        state.token = action.payload.token;
        state.status = 'succeeded';
        state.error = null;
      })
      .addCase(checkAuthStatus.rejected, (state, action) => {
        state.isAuthenticated = false;
        state.user = null;
        state.token = null;
        state.status = 'failed';
        state.error = action.error.message || 'Failed to check auth status';
      });
  }
});

export const { login, logout, setAuthenticated, setUser } = authSlice.actions;
export default authSlice.reducer;