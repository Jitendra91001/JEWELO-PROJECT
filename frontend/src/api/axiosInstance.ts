import axios, { AxiosError } from "axios";
import { API_BASE_URL } from "@/utils/constants";
import { store } from "@/store";
import { logout } from "@/store/authSlice";

const axiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API_URL || API_BASE_URL || "http://localhost:5000",
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
});

axiosInstance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

axiosInstance.interceptors.response.use(
  (response) => response,
  (error: AxiosError) => {
    const status = error.response?.status;
    const isAuthRoute = error.config?.url?.includes("/auth/login") || error.config?.url?.includes("/auth/register");

    // Only redirect to login if user was authenticated and their token expired/became invalid
    if ((status === 401 || status === 419) && !isAuthRoute) {
      const hadToken = !!localStorage.getItem("token");
      if (hadToken) {
        store.dispatch(logout());
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        if (!window.location.pathname.includes("/login")) {
          window.location.replace("/login");
        }
      }
    }
    return Promise.reject(error);
  }
);

export default axiosInstance;
