import { Response } from 'express';
import { ApiResponse } from '../types';

export const sendSuccess = <T = any>(
  res: Response,
  data: T,
  message: string = 'Success',
  statusCode: number = 200,
  pagination?: any
) => {
  const response: ApiResponse<T> = {
    success: true,
    message,
    data,
    ...(pagination && { pagination }),
  };

  return res.status(statusCode).json(response);
};

export const sendError = (
  res: Response,
  statusCode: number,
  message: string,
  errors?: Record<string, any>
) => {
  const response: ApiResponse = {
    success: false,
    message,
    ...(errors && { error: errors }),
  };

  return res.status(statusCode).json(response);
};

export const sendPaginatedSuccess = <T = any>(
  res: Response,
  data: T[],
  total: number,
  page: number,
  limit: number,
  message: string = 'Success',
  statusCode: number = 200
) => {
  const pages = Math.ceil(total / limit);
  
  const response: ApiResponse<T[]> = {
    success: true,
    message,
    data,
    pagination: {
      total,
      page,
      limit,
      pages,
    },
  };

  return res.status(statusCode).json(response);
};
