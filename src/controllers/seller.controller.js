import { Seller } from "../models/seller.model.js"; // Adjust the path as needed
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";

// Register a new seller
export const registerSeller = asyncHandler(async (req, res) => {
    const { fullName, userName, email, password, storeName, storeDescription, phoneNo, address, location } = req.body;

    // Check if seller with the same email or username already exists
    const existingSeller = await Seller.findOne({
        $or: [{ email }, { userName }]
    });

    if (existingSeller) {
        throw new ApiError(409, "Seller with this email or username already exists");
    }

    // // Handle avatar file upload (assuming file upload middleware is used, e.g., multer)
    // const avatarLocalPath = req.files && req.files.avatar ? req.files.avatar[0].path : null;

    // if (!avatarLocalPath) {
    //     throw new ApiError(400, "Avatar is required");
    // }

    // // Upload avatar to Cloudinary
    // const avatar = await uploadToCloudinary(avatarLocalPath);

    // // Safe check
    // if (!avatar) {
    //     throw new ApiError(400, "Avatar upload failed");
    // }

    // Create a new seller instance
    const seller = await Seller.create({
        fullName,
        userName: userName.toLowerCase(),
        email,
        password,
        storeName,
        storeDescription,
        phoneNo,
        address,
        location
    });

    // Retrieve created seller without sensitive fields
    const createdSeller = await Seller.findById(seller._id).select("-password");

    if (!createdSeller) {
        throw new ApiError(500, "Seller registration failed");
    } else {
        res.status(201).json(new ApiResponse(201, createdSeller, "Seller registered successfully"));
    }
});
