import validator from 'validator';
import { ApiError } from "../utils/ApiError.js";

const validateRequest = (req,res,next) => {
    const data = req.body;
    let errors = {};

    // Validate requestTitle
    if (!data.requestTitle || validator.isEmpty(data.requestTitle)) {
        errors.requestTitle = 'Request title is required';
    } else if (!validator.isLength(data.requestTitle, { min: 3, max: 100 })) {
        errors.requestTitle = 'Request title must be between 3 and 100 characters long';
    }

    // Validate requestDescription
    if (!data.requestDescription || validator.isEmpty(data.requestDescription)) {
        errors.requestDescription = 'Request description is required';
    } else if (!validator.isLength(data.requestDescription, { min: 10, max: 500 })) {
        errors.requestDescription = 'Request description must be between 10 and 500 characters long';
    }

    // Validate requestImage (if provided)
    // if (data.requestImage && !validator.isEmpty(data.requestImage) && !validator.isURL(data.requestImage)) {
    //     errors.requestImage = 'Request image must be a valid URL';
    // }

    // Validate clientId
    // if (!data.clientId || validator.isEmpty(data.clientId)) {
    //     errors.clientId = 'Client ID is required';
    // }

    // Validate vendorId (if provided)
    // if (data.vendorId && !validator.isMongoId(data.vendorId)) {
    //     errors.vendorId = 'Vendor ID must be a valid Mongo ID';
    // }

    // Validate status
    // const validStatuses = ['open', 'in-progress', 'completed', 'canceled'];
    // if (!data.status || !validStatuses.includes(data.status)) {
    //     errors.status = 'Status must be one of: open, in-progress, completed, canceled';
    // }

    // Validate category
    if (!data.category || validator.isEmpty(data.category)) {
        errors.category = 'Category is required';
    }

    // Validate budget
    if (!data.budget || validator.isEmpty(data.budget.toString())) {
        errors.budget = 'Budget is required';
    } else if (!validator.isNumeric(data.budget.toString(), { no_symbols: true }) || data.budget <= 0) {
        errors.budget = 'Budget must be a positive number';
    }

    // Validate attachments (if provided)
    // if (data.attachments && !validator.isEmpty(data.attachments) && !validator.isURL(data.attachments)) {
    //     errors.attachments = 'Attachments must be a valid URL';
    // }

    // Check if there are any errors
    if (Object.keys(errors).length > 0) {
        throw new ApiError(400, errors[Object.keys(errors)[0]]);
    }

    next();

};

export {validateRequest};
