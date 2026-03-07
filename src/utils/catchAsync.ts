import { Request, Response, NextFunction } from 'express';

/**
 * Wrapper for asynchronous Express middleware and controllers.
 * It catches any rejected promises and passes the error to the next() function,
 * routing it directly to the Global Error Handler.
 */
export const catchAsync = (fn: Function) => {
    return (req: Request, res: Response, next: NextFunction) => {
        // Execute the function and catch any errors, passing them to next()
        Promise.resolve(fn(req, res, next)).catch(next);
    };
};