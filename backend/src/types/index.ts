import { Request } from "express";
import { UserRoleType } from "../constants";
import { Types } from "mongoose";

export interface IAuthUser {
  id: string;
  _id?: Types.ObjectId | string;
  email: string;
  name?: string;
  role: UserRoleType | string;
  permissions?: string[];
}

export interface AuthenticatedRequest extends Request {
  user?: IAuthUser;
}

export interface PaginationParams {
  page?: number;
  limit?: number;
  sortBy?: string;
  sortOrder?: "asc" | "desc";
  search?: string;
}

export interface PaginatedResult<T> {
  docs: T[];
  totalDocs: number;
  limit: number;
  page: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPrevPage: boolean;
  nextPage: number | null;
  prevPage: number | null;
}

export interface ApiResponseFormat<T = any> {
  success: boolean;
  statusCode: number;
  message: string;
  data?: T;
  meta?: {
    page?: number;
    limit?: number;
    total?: number;
    totalPages?: number;
    [key: string]: any;
  };
  errors?: any;
  timestamp: string;
}

export interface EmailOptions {
  to: string;
  subject: string;
  html: string;
  text?: string;
}

export interface JwtPayload {
  id: string;
  email: string;
  role: string;
  [key: string]: any;
}

export interface ApiResponse<T = any> {
  success: boolean;
  message: string;
  data?: T;
  pagination?: any;
  error?: any;
  errors?: any;
}
