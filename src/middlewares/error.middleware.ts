import { Request, Response, NextFunction } from 'express';
import { AppError } from '../errors/AppError';

/**
 * Global Error Handling Middleware for Express.
 * Catches all errors thrown in the application and formats the HTTP response.
 */
export const globalErrorHandler = (
    err: Error, 
    req: Request, 
    res: Response, 
    next: NextFunction
): void => {
    // If the error is a known operational error (thrown by our code)
    if (err instanceof AppError) {
        res.status(err.statusCode).json({
            status: 'error',
            message: err.message
        });
        return;
    }

    // If it's an unknown error (e.g., database crashed, syntax error, etc.)
    console.error('CRITICAL ERROR:', err);

    res.status(500).json({
        status: 'fail',
        message: 'Internal Server Error'
    });
};