import { Request, Response, NextFunction } from "express";
import { ApiError } from "../utils/ApiError";

export const notFoundHandler = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const error = ApiError.notFound(
    `API route '${req.method} ${req.originalUrl}' does not exist on this server.`
  );
  next(error);
};

export default notFoundHandler;
