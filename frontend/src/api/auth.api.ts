import axiosInstance from "./axiosInstance";

export interface LoginPayload {
  email: string;
  password: string;
}

export interface ResetPassword {
  token:string;
  password: string;
  confirmPassword: string;
}

export interface RegisterPayload {
  name: string;
  email: string;
  password: string;
  phone?: string;
}

export const authAPI = {
  login: (data: LoginPayload) => axiosInstance.post("/api/v1/auth/login", data),
  register: (data: RegisterPayload) => axiosInstance.post("/api/v1/auth/register", data),
  resetPassword: (data: ResetPassword) => axiosInstance.post("/api/v1/auth/reset-password", data),
  getProfile: () => axiosInstance.get("/api/v1/auth/profile"),
  updateProfile: (data: Partial<RegisterPayload>) => axiosInstance.put("/api/v1/auth/profile", data),
  forgotPassword: (email: string) => axiosInstance.post("/api/v1/auth/forgot-password", { email }),
};
