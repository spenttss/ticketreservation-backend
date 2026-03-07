/**
 * Custom error class to handle operational errors globally.
 * Extends the built-in Error class to include HTTP status codes.
 */
export class AppError extends Error {
    public readonly statusCode: number;
    public readonly isOperational: boolean;

    constructor(message: string, statusCode: number) {
        super(message);
        this.statusCode = statusCode;
        // isOperational ensures we only leak safe error messages to the client,
        // hiding complex bugs or database connection errors.
        this.isOperational = true;
        
        // Captures the stack trace, excluding the constructor call from it.
        Error.captureStackTrace(this, this.constructor);
    }
}