export const sendSuccessResponse = (res, statusCode, message, data = {}) => {
    res.status(statusCode).json({
        success: true,
        message,
        data,
    });
};

export const sendErrorResponse = (res, error) => {
    const statusCode = error.statusCode || 500;
    const message = error.message || 'An unexpected error occurred.';
    const errors = error.errors || null; 

    res.status(statusCode).json({
        success: false,
        message,
        errors, 
    });
};