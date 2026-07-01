import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { loginApi, registerApi, getMeApi, type UserResponse } from "../api/auth";

interface User {
  userId: string;
  username: string;
  email: string;
  role?: string;
}

interface AuthState {
  user: User | null;
  accessToken: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
}

interface LoginPayload {
  email: string;
  password: string;
}

interface RegisterPayload {
  username: string;
  email: string;
  password: string;
}

interface AuthResponse {
  message: string;
  userId: string;
  username: string;
  email: string;
  accessToken: string;
  role?: string;
}

const savedUser = localStorage.getItem("user");

const initialState: AuthState = {
  user: savedUser ? JSON.parse(savedUser) : null,
  accessToken: localStorage.getItem("accessToken"),
  isAuthenticated: !!localStorage.getItem("accessToken"),
  isLoading: false,
  error: null,
};

// Helper function to update auth state
const setAuthState = (state: AuthState, payload: AuthResponse) => {
  state.isLoading = false;
  state.isAuthenticated = true;
  state.error = null;

  state.user = {
    userId: payload.userId,
    username: payload.username,
    email: payload.email,
    role: payload.role,
  };

  state.accessToken = payload.accessToken;
  localStorage.setItem("accessToken", payload.accessToken);
  localStorage.setItem("user", JSON.stringify(state.user));
};

// Login Thunk
export const loginUserThunk = createAsyncThunk<
  AuthResponse,
  LoginPayload,
  { rejectValue: string }
>("auth/login", async ({ email, password }, { rejectWithValue }) => {
  try {
    return await loginApi(email, password);
  } catch (error) {
    if (error instanceof Error) {
      return rejectWithValue(error.message);
    }

    return rejectWithValue("Something went wrong");
  }
});

// Register Thunk
export const registerUserThunk = createAsyncThunk<
  AuthResponse,
  RegisterPayload,
  { rejectValue: string }
>("auth/register", async ({ username, email, password }, { rejectWithValue }) => {
  try {
    return await registerApi(username, email, password);
  } catch (error) {
    if (error instanceof Error) {
      return rejectWithValue(error.message);
    }

    return rejectWithValue("Something went wrong");
  }
});


// Fetch Current User Thunk (Session Hydration)
export const fetchUserThunk = createAsyncThunk<
  UserResponse,
  void,
  { rejectValue: string }
>("auth/fetchUser", async (_, { rejectWithValue }) => {
  try {
    return await getMeApi();
  } catch (error) {
    if (error instanceof Error) {
      return rejectWithValue(error.message);
    }
    return rejectWithValue("Failed to fetch user");
  }
});

const authSlice = createSlice({
  name: "auth",
  initialState,

  reducers: {
    logout: (state) => {
      state.user = null;
      state.accessToken = null;
      state.isAuthenticated = false;
      state.isLoading = false;
      state.error = null;
      localStorage.removeItem("accessToken");
      localStorage.removeItem("user");
    },
  },

  extraReducers: (builder) => {
    // Login
    builder
      .addCase(loginUserThunk.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(loginUserThunk.fulfilled, (state, action) => {
        setAuthState(state, action.payload);
      })
      .addCase(loginUserThunk.rejected, (state, action) => {
        state.isLoading = false;
        state.isAuthenticated = false;
        state.error = action.payload ?? "Login failed";
      });

    // Register
    builder
      .addCase(registerUserThunk.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(registerUserThunk.fulfilled, (state, action) => {
        setAuthState(state, action.payload);
      })
      .addCase(registerUserThunk.rejected, (state, action) => {
        state.isLoading = false;
        state.isAuthenticated = false;
        state.error = action.payload ?? "Registration failed";
      });

    // Fetch User
    builder
      .addCase(fetchUserThunk.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(fetchUserThunk.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isAuthenticated = true;
        state.user = {
          userId: action.payload.userId,
          username: action.payload.username,
          email: action.payload.email,
          role: action.payload.role,
        };
      })
      .addCase(fetchUserThunk.rejected, (state) => {
        state.user = null;
        state.accessToken = null;
        state.isAuthenticated = false;
        localStorage.removeItem("accessToken");
      });
  },
});

export const { logout } = authSlice.actions;

export default authSlice.reducer;