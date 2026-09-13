import { Response } from "express";
import { asyncHandler } from "../utils/asyncHandler";
import { ApiResponse } from "../utils/ApiResponse";
import { ApiError } from "../utils/ApiError";
import { Feedback } from "../models/Feedback.model";
import { AuthenticatedRequest } from "../types";

export const getFeedbacks = asyncHandler(async (_req: AuthenticatedRequest, res: Response) => {
  const feedbacks = await Feedback.find().sort({ createdAt: -1 });
  return ApiResponse.success(res, "Feedback retrieved successfully", feedbacks);
});

export const createFeedback = asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
  const { name, rating, descriptionText } = req.body;
  const feedback = await Feedback.create({
    name,
    rating: Number(rating),
    descriptionText,
  });
  return ApiResponse.created(res, "Feedback created successfully", feedback);
});

export const deleteFeedback = asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
  const { id } = req.params;
  const feedback = await Feedback.findByIdAndDelete(id);
  if (!feedback) {
    throw ApiError.notFound("Feedback not found");
  }
  return ApiResponse.success(res, "Feedback deleted successfully");
});
