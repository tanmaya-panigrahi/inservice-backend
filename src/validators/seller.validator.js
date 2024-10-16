import validator from "validator";
import { ApiError } from "../utils/ApiError.js";

// Validate seller data
const validateSeller = (req, res, next) => {
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

    // Validate password
    if (!data.password || validator.isEmpty(data.password)) {
        errors.password = 'Password is required';
    } else if (!validator.isStrongPassword(data.password, {
        minLength: 8,
        minLowercase: 0,     // You don't need to enforce lowercase
        minUppercase: 1,     // At least 1 uppercase letter
        minNumbers: 1,       // At least 1 digit
        minSymbols: 1,       // At least 1 special character
    })) {
        errors.password = 'Password must be at least 8 characters long, contain at least one uppercase letter, one number, and one special character';
    }

    // Validate phone number (assuming it's a 10-digit number)
    if (!data.phoneNo || validator.isEmpty(data.phoneNo.trim())) {
        errors.phoneNo = 'Phone number is required';
    } else if (!validator.isMobilePhone(data.phoneNo.trim(), 'any', { strictMode: false })) {
        errors.phoneNo = 'Invalid phone number';
    }

    // Validate address
    if (!data.address || validator.isEmpty(data.address.trim())) {
        errors.address = 'Address is required';
    }

    // Validate store name
    if (!data.storeName || validator.isEmpty(data.storeName.trim())) {
        errors.storeName = 'Store name is required';
    }

    // Validate country inside location
    if (!data.location || !data.location.country || validator.isEmpty(data.location.country.trim())) {
        errors.country = 'Country is required';
    }

    // Validate address inside location
    if (!data.location || !data.location.address || validator.isEmpty(data.location.address.trim())) {
        errors.locationAddress = 'Location address is required';
    }

    // Check if there are any errors
    // if (Object.keys(errors).length > 0) {
    //     return res.status(400).json({
    //         success: false,
    //         message : errors[Object.keys(errors)[0]],
    //     });
    // }
    
    if (Object.keys(errors).length > 0) {
       throw new ApiError(400, errors[Object.keys(errors)[0]]);
    }

    // No errors, proceed to next middleware
    next();
};

export { validateSeller };
