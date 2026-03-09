import { Request, Response, NextFunction } from 'express';
import { z, ZodError } from 'zod';
import { AppError } from '../errors/AppError';

export const validate =
  (schema: z.ZodTypeAny) =>
  (req: Request, res: Response, next: NextFunction): void => {
    try {
      schema.parse({
        body: req.body,
        query: req.query,
        params: req.params,
      });

      next();
    } catch (error) {
      if (error instanceof ZodError) {
        const message = error.issues
          .map((issue: z.ZodIssue) => issue.message)
          .join(", ");

        return next(new AppError(`Validation failed: ${message}`, 400));
      }

      next(error);
    }
  };