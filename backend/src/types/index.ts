import { Request } from 'express';
import { UserRole } from '@prisma/client';

export interface AuthenticatedRequest extends Request {
  user?: {
    id: string;
    email: string;
    role: UserRole;
  };
}

export interface PaginationQuery {
  page?: number;
  limit?: number;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
  search?: string;
}

export interface ApiResponse<T = any> {
  success: boolean;
  message?: string;
  data?: T;
  error?: string | Record<string, any>;
  pagination?: {
    total: number;
    page: number;
    limit: number;
    pages: number;
  };
}

export interface JwtPayload {
  id: string;
  email: string;
  role: UserRole;
}

export interface EmailOptions {
  to: string;
  subject: string;
  html: string;
}
