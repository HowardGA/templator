class ApiError extends Error {
    constructor(message, statusCode = 500) {
        super(message);
        this.name = this.constructor.name;
        this.statusCode = statusCode;

        if (Error.captureStackTrace) {
            Error.captureStackTrace(this, this.constructor);
        }
    }
};

export class ConflictError extends ApiError {
    constructor(message = "Resource conflict", errors = []) {
        super(message, 409);
        this.name = 'ConflictError';
        this.errors = errors;
    }
};

export class NotFoundError extends ApiError {
    constructor(message = "Resource not found") {
        super(message, 404);
        this.name = 'NotFoundError';
    }
};

export class ValidationError extends ApiError {
    constructor(message = "Validation failed", errors = []) {
        super(message, 400); 
        this.name = 'ValidationError';
        this.errors = errors; 
    }
}
