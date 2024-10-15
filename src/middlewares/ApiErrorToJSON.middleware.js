const ApiErrorToJSON = (err, req, res, next) => {
    const code = err.code || 500; 
    const message = err.message || "Internal Server Error";
    const errors = err.errors || []; // Default empty array for errors

    // Send JSON response
    res.status(code).json({
        success: false,
        message: message,
        errors: errors, // Any additional error details if provided
    });
}

export { ApiErrorToJSON };