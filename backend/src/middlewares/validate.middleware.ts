import { Request, Response, NextFunction } from "express";
import { AnyZodObject, ZodEffects, ZodError } from "zod";
import { ApiError } from "../utils/ApiError";

type SchemaType = AnyZodObject | ZodEffects<AnyZodObject> | ZodEffects<any>;

export const validate = (schema: SchemaType) => {
  return async (req: Request, _res: Response, next: NextFunction): Promise<void> => {
    try {
      // Support schemas validating req.body directly or schemas wrapping body/query/params
      const parsed = await schema.parseAsync({
        body: req.body,
        query: req.query,
        params: req.params,
        ...req.body, // In case schema is just for req.body directly
      });

      // If schema had top-level body/query/params properties
      if ("body" in parsed || "query" in parsed || "params" in parsed) {
        if (parsed.body) req.body = parsed.body;
        if (parsed.query) req.query = parsed.query;
        if (parsed.params) req.params = parsed.params;
      }

      next();
    } catch (error) {
      if (error instanceof ZodError) {
        const issues = error.errors.map((err) => ({
          field: err.path.join("."),
          message: err.message,
        }));
        next(ApiError.badRequest("Validation failed", issues));
      } else {
        next(error);
      }
    }
  };
};

export default validate;
