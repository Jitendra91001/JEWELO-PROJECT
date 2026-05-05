import axios, { AxiosError } from "axios";
import { API_BASE_URL } from "@/utils/constants";
import { store } from "@/store";
import { logout } from "@/store/authSlice";

const axiosInstance = axios.create({
  baseURL: API_BASE_URL,
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
  (error) => Promise.reject(error),
);

axiosInstance.interceptors.response.use(
  (response) => response,
  (error: AxiosError) => {
    if (error.response?.status === 401) {
      store.dispatch(logout());
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      window.location.replace("/login");
    }
    return Promise.reject(error);
  },
);

export default axiosInstance;
