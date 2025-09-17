import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import * as SecureStore from "expo-secure-store";
import {
  login,
  logout,
  meAuth,
  refresh,
  register,
} from "../../../services/api";

const initialState = {
  isAuthenticated: false,
  user: null,
  accessToken: null,
  refreshToken: null,
  status: "idle", // 'idle' | 'loading' | 'succeeded' | 'failed'
  error: null,
};

export const initializeAuth = createAsyncThunk(
  "auth/initialize",
  async (_, { rejectWithValue }) => {
    try {
      const accessToken = await SecureStore.getItemAsync("accessToken");
      const refreshToken = await SecureStore.getItemAsync("refreshToken");
      const userId = await SecureStore.getItemAsync("userId");
      if (accessToken && refreshToken) {
        const response = await meAuth({ id: userId });
        if (response && response.data) {
          return { accessToken, refreshToken, user: response.data };
        }
      }
      return rejectWithValue("No tokens found");
    } catch (error) {
      console.log(error);
      return rejectWithValue(error.toString());
    }
  }
);

export const registerThunk = createAsyncThunk(
  "auth/register",
  async (credentials, { rejectWithValue }) => {
    try {
      const response = await register(credentials);
      return response.data;
    } catch (err) {
      return rejectWithValue(
        err.response?.data?.message || "Registration failed"
      );
    }
  }
);

export const loginThunk = createAsyncThunk(
  "auth/login",
  async (credentials, { rejectWithValue }) => {
    try {
      const response = await login(credentials);
      const { accessToken, refreshToken, userId } = response.data;
      await SecureStore.setItemAsync("accessToken", accessToken);
      await SecureStore.setItemAsync("refreshToken", refreshToken);
      await SecureStore.setItemAsync("userId", userId);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || "Login failed");
    }
  }
);

export const refreshThunk = createAsyncThunk(
  "auth/refresh",
  async (_, { rejectWithValue }) => {
    try {
      const refreshToken = SecureStore.getItemAsync("refreshToken");
      const response = await refresh(refreshToken);
      const { accessToken } = response.data;
      await SecureStore.setItemAsync("accessToken", accessToken);
      return response.data;
    } catch (error) {
      await SecureStore.deleteItemAsync("accessToken");
      await SecureStore.deleteItemAsync("refreshToken");
      return rejectWithValue(error.response?.data?.message || "Refresh failed");
    }
  }
);

export const logoutThunk = createAsyncThunk(
  "auth/logout",
  async (_, { rejectWithValue }) => {
    try {
      const refreshToken = await SecureStore.getItemAsync("refreshToken");
      if (!refreshToken) {
        return rejectWithValue("No refresh token available");
      }
      const response = await logout(refreshToken);
      await SecureStore.deleteItemAsync("accessToken");
      await SecureStore.deleteItemAsync("refreshToken");
      await SecureStore.deleteItemAsync("userId");
      return response.data;
    } catch (error) {
      console.log(error);
      
      return rejectWithValue(error.response?.data?.message || "Logout failed");
    }
  }
);

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    resetError(state) {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    //Initialize thunk
    builder.addCase(initializeAuth.pending, (state) => {
      state.status = "loading";
      state.error = null;
    });
    builder.addCase(initializeAuth.fulfilled, (state, action) => {
      state.status = "succeeded";
      state.user = action.payload.user;
      state.accessToken = action.payload.accessToken;
      state.refreshToken = action.payload.refreshToken;
      state.error = null;
    });
    builder.addCase(initializeAuth.rejected, (state, action) => {
      state.status = "failed";
      state.error = action.payload || "Registeration failed";
    });

    //Register
    builder.addCase(registerThunk.pending, (state) => {
      state.status = "loading";
      state.error = null;
    });
    builder.addCase(registerThunk.fulfilled, (state, action) => {
      state.status = "succeeded";
      state.user = action.payload.user;
      state.error = null;
    });
    builder.addCase(registerThunk.rejected, (state, action) => {
      state.status = "failed";
      state.error = action.payload || "Registeration failed";
    });

    //Login
    builder.addCase(loginThunk.pending, (state) => {
      state.status = "loading";
      state.error = null;
    });
    builder.addCase(loginThunk.fulfilled, (state, action) => {
      state.status = "succeeded";
      state.user = action.payload.user || state.user;
      state.accessToken = action.payload.accessToken;
      state.refreshToken = action.payload.refreshToken;
      initializeAuth();
    });
    builder.addCase(loginThunk.rejected, (state, action) => {
      state.status = "failed";
      state.error = action.payload || "Refresh failed";
    });

    // Refresh
    builder.addCase(refreshThunk.pending, (state) => {
      state.status = "loading";
      state.error = null;
    });
    builder.addCase(refreshThunk.fulfilled, (state, action) => {
      state.status = "succeeded";
      state.accessToken = action.payload.accessToken;
    });
    builder.addCase(refreshThunk.rejected, (state, action) => {
      state.status = "failed";
      state.error = action.payload || "Refresh failed";
      state.user = null;
      state.accessToken = null;
      state.refreshToken = null;
    });

    // Logout
    builder.addCase(logoutThunk.pending, (state) => {
      state.status = "loading";
      state.error = null;
    });
    builder.addCase(logoutThunk.fulfilled, (state) => {
      state.status = "idle";
      state.user = null;
      state.accessToken = null;
      state.refreshToken = null;
    });
    builder.addCase(logoutThunk.rejected, (state, action) => {
      state.status = "failed";
      state.error = action.payload || "Logout failed";
    });
  },
});

// export const loginUser = createAsyncThunk(
//   "auth/login",
//   async ({ user, accessToken, refreshToken }, { dispatch }) => {
//     await SecureStore.setItemAsync("accessToken", accessToken);
//     await SecureStore.setItemAsync("refreshToken", refreshToken);
//     dispatch(login({ user, accessToken, refreshToken }));
//     return { user, accessToken, refreshToken };
//   }
// );

// export const logoutUser = createAsyncThunk(
//   "auth/logout",
//   async (_, { dispatch }) => {
//     await SecureStore.deleteItemAsync("accessToken");
//     await SecureStore.deleteItemAsync("refreshToken");
//     dispatch(logout());
//   }
// );

// export const authSlice = createSlice({
//   name: "auth",
//   initialState,
//   reducers: {
//     login: (state, action) => {
//       state.isAuthenticated = true;
//       state.user = action.payload.user;
//       state.accessToken = action.payload.accessToken;
//       state.refreshToken = action.payload.refreshToken;
//       state.status = "succeeded";
//     },
//     logout: (state) => {
//       state.isAuthenticated = false;
//       state.user = null;
//       state.accessToken = null;
//       state.refreshToken = null;
//       state.status = "idle";
//     },
//   },
//   extraReducers: (builder) => {
//     builder
//       .addCase(initializeAuth.pending, (state) => {
//         state.status = "loading";
//       })
//       .addCase(initializeAuth.fulfilled, (state, action) => {
//         state.isAuthenticated = true;
//         state.accessToken = action.payload.accessToken;
//         state.refreshToken = action.payload.refreshToken;
//         state.status = "succeeded";
//       })
//       .addCase(initializeAuth.rejected, (state, action) => {
//         state.status = "failed";
//         state.error = action.payload;
//       });
//   },
// });

export const { resetError } = authSlice.actions;

export default authSlice.reducer;
