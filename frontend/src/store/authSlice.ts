// src/store/authSlice.ts
import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import { authAPI, LoginPayload, RegisterPayload, ResetPassword, updateprofileType } from "@/api/auth.api";

interface User {
  id: string;
  name: string;
  email: string;
  phone?: string;
  role?: string;
}

interface AuthState {
  user: User | null;
  token: string | null;
  loading: boolean;
  error: string | null;
  isAuthenticated: boolean;
  roles: string;
}

const initialState: AuthState = {
  user: JSON.parse(localStorage.getItem("user") || "null"),
  token: localStorage.getItem("token"),
  loading: false,
  error: null,
  roles: null,
  isAuthenticated: localStorage.getItem("token") ? true : false,
};

export const loginUser = createAsyncThunk(
  "auth/login",
  async (data: LoginPayload, { rejectWithValue }) => {
    try {
      const res = await authAPI.login(data);
      return res.data;
    } catch (err: any) {
      return rejectWithValue(err.response?.data?.message || "Login failed");
    }
  },
);

export const resetPassword = createAsyncThunk(
  "auth/login",
  async (data: ResetPassword, { rejectWithValue }) => {
    try {
      const res = await authAPI.resetPassword(data);
      return res.data;
    } catch (err: any) {
      return rejectWithValue(err.response?.data?.message || "Login failed");
    }
  },
);

export const updateProfile = createAsyncThunk(
  "auth/login",
  async (data:updateprofileType , { rejectWithValue }) => {
    try {
      const res = await authAPI.updateProfile(data);
      return res.data;
    } catch (err: any) {
      return rejectWithValue(err.response?.data?.message || "Login failed");
    }
  },
);

export const registerUser = createAsyncThunk(
  "auth/register",
  async (data: RegisterPayload, { rejectWithValue }) => {
    try {
      const res = await authAPI.register(data);
      return res.data;
    } catch (err: any) {
      return rejectWithValue(
        err.response?.data?.message || "Registration failed",
      );
    }
  },
);

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    logout: (state) => {
      state.user = null;
      state.token = null;
      state.error = null;
      state.isAuthenticated = false;
      localStorage.removeItem("token");
      localStorage.removeItem("user");
    },
    clearError: (state) => {
      state.error = null;
    },
    setAuthFromLocalStorage: (state) => {
      const storedUser = localStorage.getItem("user");
      const storedToken = localStorage.getItem("token");

      if (storedUser && storedToken) {
        state.user = JSON.parse(storedUser);
        state.token = storedToken;
        state.isAuthenticated = true;
      }
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(loginUser.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.roles = null;
      })
      .addCase(loginUser.fulfilled, (state, action: PayloadAction<any>) => {
        state.loading = false;
        state.user = action?.payload?.data?.user;
        state.token = action?.payload?.data?.token;
        state.isAuthenticated = true;
        state.roles = action?.payload?.data?.user?.role;
        localStorage.setItem("token", state.token || "");
        localStorage.setItem("user", JSON.stringify(state.user));
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.loading = false;
        state.roles = null;
        state.error = action.payload as string;
      })

      .addCase(registerUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(registerUser.fulfilled, (state, action: PayloadAction<any>) => {
        state.loading = false;
        state.user = action?.payload?.data?.user;
        state.token = action?.payload?.data?.token;
      })
      .addCase(registerUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export const { logout, clearError, setAuthFromLocalStorage } =
  authSlice.actions;
export default authSlice.reducer;
