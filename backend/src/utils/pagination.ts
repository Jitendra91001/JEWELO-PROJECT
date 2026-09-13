import { Request } from "express";
import { Query } from "mongoose";

export interface PaginationOptions {
  page?: number | string;
  limit?: number | string;
  maxLimit?: number;
  defaultLimit?: number;
}

export interface PaginationMeta {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
}

export interface PaginatedResponse<T> {
  data: T[];
  pagination: PaginationMeta;
}

export const parsePaginationParams = (
  req: Request,
  options: { defaultLimit?: number; maxLimit?: number } = {}
) => {
  const defaultLimit = options.defaultLimit || 20;
  const maxLimit = options.maxLimit || 100;

  const rawPage = parseInt(req.query.page as string, 10);
  const rawLimit = parseInt((req.query.limit || req.query.size) as string, 10);

  const page = !isNaN(rawPage) && rawPage > 0 ? rawPage : 1;
  let limit = !isNaN(rawLimit) && rawLimit > 0 ? rawLimit : defaultLimit;

  if (limit > maxLimit) {
    limit = maxLimit;
  }

  const skip = (page - 1) * limit;

  return { page, limit, skip };
};

export const buildPaginationMeta = (
  total: number,
  page: number,
  limit: number
): PaginationMeta => {
  const totalPages = Math.ceil(total / limit) || 1;
  return {
    page,
    limit,
    total,
    totalPages,
    hasNextPage: page < totalPages,
    hasPreviousPage: page > 1,
  };
};

export const paginateQuery = async <T>(
  query: Query<T[], T>,
  countQuery: () => Promise<number>,
  page: number,
  limit: number
): Promise<PaginatedResponse<T>> => {
  const skip = (page - 1) * limit;

  const [data, total] = await Promise.all([
    query.skip(skip).limit(limit).exec(),
    countQuery(),
  ]);

  return {
    data,
    pagination: buildPaginationMeta(total, page, limit),
  };
};
