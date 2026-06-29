import axios from "axios";

const API = axios.create({
  baseURL: "https://movie-review-backend-kiv0.onrender.com/api",
  headers: {
    "Content-Type": "application/json",
  },
});

API.interceptors.request.use((config) => {
  const token = localStorage.getItem("accessToken");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

interface AuthResponse {
  message: string;
  userId: string;
  username: string;
  email: string;
  accessToken: string;
}

// Login API
export const loginApi = async (
  email: string,
  password: string
): Promise<AuthResponse> => {
  const response = await API.post<AuthResponse>("/auth/login", {
    email,
    password,
  });

  return response.data;
};

// Register API
export const registerApi = async (
  username: string,
  email: string,
  password: string
): Promise<AuthResponse> => {
  const response = await API.post<AuthResponse>("/auth/register", {
    username,
    email,
    password,
  });

  return response.data;
};

// Logout API
export const logoutApi = async (): Promise<{ message: string }> => {
  const response = await API.post("/auth/logout");
  return response.data;
};

export interface UserResponse {
  userId: string;
  username: string;
  email: string;
  role?: string;
}

// Get Current User API
export const getMeApi = async (): Promise<UserResponse> => {
  const response = await API.get<UserResponse>("/auth/me");
  return response.data;
};

export default API;