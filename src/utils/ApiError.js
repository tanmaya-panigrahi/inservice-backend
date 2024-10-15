class ApiError extends Error {
    constructor(
        code,
        message = "Something went wrong",
        errors = [],
        stack = null
    ) {
        // Call the constructor of the parent class (Error) with the message parameter
        // This initializes the message property of the Error class with the provided message
        super(message);
        
        // Custom properties for the ApiError class
        this.code = code;
        this.data = null;
        this.message = message;
        this.success = false;
        this.errors = errors;
        this.stack = stack;

        // if(stack){
        //     this.stack = stack;
        // } else {
        //     Error.captureStackTrace(this, this.constructor);
        // }
    }
}

export { ApiError };