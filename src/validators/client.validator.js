import validator from "validator";
import { ApiError } from "../utils/ApiError.js";

// Validate client data
const validateClient = (req, res, next) => {
    const data = req.body;
    let errors = {};

    // Validate full name
    if (!data.fullName || validator.isEmpty(data.fullName.trim())) {
        errors.fullName = 'Full name is required';
    }

    // Validate username (required, alphanumeric, minimum length of 3)
    if (!data.userName || validator.isEmpty(data.userName.trim())) {
        errors.userName = 'Username is required';
    } else if (!validator.isAlphanumeric(data.userName.trim())) {
        errors.userName = 'Username must be alphanumeric';
    } else if (!validator.isLength(data.userName.trim(), { min: 3 })) {
        errors.userName = 'Username must be at least 3 characters long';
    }

    // Validate email
    if (!data.email || validator.isEmpty(data.email.trim())) {
        errors.email = 'Email is required';
    } else if (!validator.isEmail(data.email.trim())) {
        errors.email = 'Invalid email address';
    }

    // Validate password (minimum length 8, at least one uppercase letter, number, and special character)
    if (!data.password || validator.isEmpty(data.password)) {
        errors.password = 'Password is required';
    } else if (!validator.isStrongPassword(data.password, {
        minLength: 8,
        minLowercase: 0,  // No strict requirement for lowercase
        minUppercase: 1,  // At least 1 uppercase letter
        minNumbers: 1,    // At least 1 number
        minSymbols: 1     // At least 1 special character
    })) {
        errors.password = 'Password must be at least 8 characters long, contain at least one uppercase letter, one number, and one special character';
    }


    // Validate location
    if (!data.location || validator.isEmpty(data.location.trim())) {
        errors.location = 'Location is required';
    }
    



    // Check if there are any errors
    if (Object.keys(errors).length > 0) {
       throw new ApiError(400, errors[Object.keys(errors)[0]]);
    }

    // No errors, proceed to next middleware
    next();
};

export { validateClient };
