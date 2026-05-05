import axiosInstance from "./axiosInstance";

export interface Feedback {
  id: string;
  name: string;
  rating: number;
  descriptionText: string;
  createdAt: string;
}

export const feedbackAPI = {
  getAll: () => axiosInstance.get("/api/v1/feedback"),
  create: (data: { name: string; rating: number; descriptionText: string }) =>
    axiosInstance.post("/api/v1/feedback", data),
  delete: (id: string) => axiosInstance.delete(`/api/v1/feedback/${id}`),
};