import { Request, Response, NextFunction } from 'express';
import { AppError } from '../errors/AppError';

export const globalErrorHandler = (
  err: any,
  req: Request,
  res: Response,
  next: NextFunction,
): void => {
  if (err instanceof AppError) {
    res.status(err.statusCode).json({
      status: 'error',
      message: err.message,
    });
    return;
  }

  if (
    err instanceof SyntaxError &&
    'body' in err &&
    (err as any).status === 400
  ) {
    res.status(400).json({
      status: 'error',
      message: 'Invalid JSON format in request body',
    });
    return;
  }

  console.error('CRITICAL ERROR:', err);

  res.status(500).json({
    status: 'fail',
    message: 'Internal Server Error',
  });
};