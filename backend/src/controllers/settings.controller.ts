import { Response } from "express";
import { asyncHandler } from "../utils/asyncHandler";
import { ApiResponse } from "../utils/ApiResponse";
import { Settings } from "../models/Settings.model";
import { AuthenticatedRequest } from "../types";

export const getSettings = asyncHandler(async (_req: AuthenticatedRequest, res: Response) => {
  let settings = await Settings.findOne();
  if (!settings) {
    settings = await Settings.create({});
  }
  return ApiResponse.success(res, "Settings retrieved successfully", settings);
});

export const updateSettings = asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
  let settings = await Settings.findOne();
  if (!settings) {
    settings = await Settings.create(req.body);
  } else {
    Object.assign(settings, req.body);
    await settings.save();
  }
  return ApiResponse.success(res, "Settings updated successfully", settings);
});
