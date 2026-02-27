import { NextFunction, Request, Response } from 'express';
import { ApiError } from '../utils/errors';
import { config } from '../config/config';
import { sendError } from '../utils/response';
import { ZodError } from 'zod';

export const errorHandler = (
  error: Error | ApiError | ZodError,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  console.error('Error:', error);

  // Handle Zod validation errors
  if (error instanceof ZodError) {
    const errors: Record<string, any> = {};
    error.errors.forEach((err) => {
      const path = err.path.join('.');
      errors[path] = err.message;
    });

    return sendError(res, 400, 'Validation failed', errors);
  }

  // Handle API errors
  if (error instanceof ApiError) {
    return sendError(res, error.statusCode, error.message, error.errors);
  }

  // Handle JWT errors
  if (error.name === 'JsonWebTokenError') {
    return sendError(res, 401, 'Invalid token');
  }

  if (error.name === 'TokenExpiredError') {
    return sendError(res, 401, 'Token expired');
  }

  // Handle Prisma errors
  if (error.name === 'PrismaClientKnownRequestError') {
    const prismaError = error as any;

    if (prismaError.code === 'P2002') {
      return sendError(
        res,
        409,
        `Unique constraint violated on ${prismaError.meta?.target || 'field'}`
      );
    }

    if (prismaError.code === 'P2025') {
      return sendError(res, 404, 'Record not found');
    }
  }

  // Default error
  const statusCode =
    (error as any).statusCode || 
    (error as any).status || 
    500;
  const message =
    (error as any).message || 'Internal server error';

  sendError(
    res,
    statusCode,
    config.isDevelopment ? message : 'Internal server error'
  );
};

export const notFoundHandler = (req: Request, res: Response) => {
  sendError(res, 404, `Route not found: ${req.originalUrl}`);
};
