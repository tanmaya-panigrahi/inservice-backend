import validator from "validator";
import { ApiError } from "../utils/ApiError.js";

// Validate vendor data
const validateVendor = (req, res, next) => {
    const data = req.body;
    let errors = {};

    // Validate full name
    if (!data.fullName || validator.isEmpty(data.fullName.trim())) {
        errors.fullName = 'Full name is required';
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

    // Validate address
    if (!data.address || validator.isEmpty(data.address.trim())) {
        errors.address = 'Address is required';
    }

    // Validate vendor service name
    if (!data.vendorServiceName || validator.isEmpty(data.vendorServiceName.trim())) {
        errors.vendorServiceName = 'Vendor service name is required';
    }

    // Validate phone number (assuming it's a 10-digit number)
    if (!data.phoneNo || validator.isEmpty(data.phoneNo.trim())) {
        errors.phoneNo = 'Phone number is required';
    } else if (!validator.isMobilePhone(data.phoneNo.trim(), 'any', { strictMode: false })) {
        errors.phoneNo = 'Invalid phone number';
    }

    // Validate category
    if (!data.category || validator.isEmpty(data.category.trim())) {
        errors.category = 'Category is required';
    }

    // Check if there are any errors
    if (Object.keys(errors).length > 0) {
        throw new ApiError(400, errors[Object.keys(errors)[0]]);
    }

    // No errors, proceed to next middleware
    next();
};

export { validateVendor };