import { Seller } from "../models/seller.model.js"; // Adjust the path as needed
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { generateAccessAndRefreshToken } from "../utils/generateTokens.js";
import { options } from "../constants.js";

// Register a new seller
const registerSeller = asyncHandler(async (req, res) => {
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

const loginSeller = asyncHandler(async (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
        throw new ApiError(400, "Email and password are required.");
    }

    const seller = await Seller.findOne({ email });

    if (!seller) {
        throw new ApiError(400, "Seller does not exist. Please register.")
    }

    const isPasswordValid = await seller.isPasswordCorrect(password);

    if (!isPasswordValid) {
        throw new ApiError(400, "Invalid email or password");
    }

    const { accessToken, refreshToken } = await generateAccessAndRefreshToken(seller._id);

    const loggedInSeller = await Seller.findById(seller._id).select("-password -refreshToken");

    return res.status(200)
        .cookie("accessToken", accessToken, options)
        .cookie("refreshToken", refreshToken, options)
        .json(new ApiResponse(
            200,
            {
                seller: loggedInSeller,
                accessToken,
                refreshToken
            },
            "Logged in successfully."
        ));
});

const logoutSeller = asyncHandler(async (req, res) => {
    const seller = await Seller.findByIdAndUpdate(
        req.seller._id,
        {
            $set: { refreshToken: undefined }
        },
        { new: true } //Return the updated document
    );

    return res.status(200)
        .clearCookie("accessToken", options)
        .clearCookie("refreshToken", options)
        .json(new ApiResponse(
            200,
            {},
            "Logged out successfully"
        ));
});

export { registerSeller, loginSeller, logoutSeller };