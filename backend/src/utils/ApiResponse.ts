import { Response } from "express";
import { HTTP_STATUS } from "../constants";
import { ApiResponseFormat } from "../types";

export class ApiResponse<T = any> {
  public success: boolean;
  public statusCode: number;
  public message: string;
  public data?: T;
  public meta?: any;
  public timestamp: string;

  constructor(
    statusCode: number = HTTP_STATUS.OK,
    message: string = "Success",
    data?: T,
    meta?: any
  ) {
    this.success = statusCode < 400;
    this.statusCode = statusCode;
    this.message = message;
    this.data = data;
    this.meta = meta;
    this.timestamp = new Date().toISOString();
  }

  static success<T>(
    res: Response,
    message: string = "Success",
    data?: T,
    statusCode: number = HTTP_STATUS.OK,
    meta?: any
  ) {
    const response = new ApiResponse(statusCode, message, data, meta);
    return res.status(statusCode).json(response);
  }

  static created<T>(
    res: Response,
    message: string = "Resource created successfully",
    data?: T
  ) {
    return ApiResponse.success(res, message, data, HTTP_STATUS.CREATED);
  }

  static paginated<T>(
    res: Response,
    message: string = "Records retrieved successfully",
    docs: T[],
    total: number,
    page: number,
    limit: number
  ) {
    const totalPages = Math.ceil(total / limit) || 1;
    const meta = {
      total,
      page,
      limit,
      totalPages,
      hasNextPage: page < totalPages,
      hasPrevPage: page > 1,
    };
    return ApiResponse.success(res, message, docs, HTTP_STATUS.OK, meta);
  }
}

export default ApiResponse;
