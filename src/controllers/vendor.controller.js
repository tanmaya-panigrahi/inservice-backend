import { Vendor } from "../models/vendor.model.js"; // Adjust the path as needed
import { Client } from "../models/client.model.js"; // Adjust the path as needed
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { generateAccessAndRefreshToken } from "../utils/generateTokens.js";
import { options } from "../constants.js";

// Register a new Vendor
const registerVendor = asyncHandler(async (req, res) => {
    // console.log(req.body.filteredData);
    console.log(req.body.filteredData);
    const { fullName, email, password, address, serviceName, serviceDescription, phone , category, ratings } = req.body.filteredData;

    // Check if Vendor  or Client with the same email or username already exists
    const existingVendor = await Vendor.findOne({email});

    const existingClient = await Client.findOne({email});

    if (existingClient || existingVendor) {
        throw new ApiError(409, "User with this email already exists");
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

    // Create a new Vendor instance
    const vendor = await Vendor.create({
        fullName,
        email,
        password,
        address,
        serviceName,
        serviceDescription,
        phone,
        category,
        ratings
    });

    // Retrieve created Vendor without sensitive fields
    const createdVendor = await Vendor.findById(vendor._id).select("-password");

    if (!createdVendor) {
        throw new ApiError(500, "Vendor registration failed");
    } else {
        res.status(201).json(new ApiResponse(201, createdVendor, "Vendor registered successfully"));
    }
});

const loginVendor = asyncHandler(async (req, res) => {
    const { email, password } = req.body.filteredData;

    if (!email || !password) {
        throw new ApiError(400, "Email and password are required.");
    }

    const vendor = await Vendor.findOne({ email });

    if (!vendor) {
        throw new ApiError(400, "Vendor does not exist. Please register.")
    }

    const isPasswordValid = await vendor.isPasswordCorrect(password);

    if (!isPasswordValid) {
        throw new ApiError(400, "Invalid email or password");
    }

    const { accessToken, refreshToken } = await generateAccessAndRefreshToken(vendor._id, Vendor);
    // console.log("refreshToken", refreshToken);
    // console.log("accessToken", accessToken);

    const loggedInVendor = await Vendor.findById(vendor._id).select("-password -refreshToken");

    return res.status(201)
        .cookie("accessToken", accessToken, options)
        .cookie("refreshToken", refreshToken, options)
        .json(new ApiResponse(
            201,
            {
                vendor: loggedInVendor,
                accessToken,
                refreshToken
            },
            "Logged in successfully."
        ));
});

const logoutVendor = asyncHandler(async (req, res) => {
    const vendor = await Vendor.findByIdAndUpdate(
        req.user._id,
        {
            $set: { refreshToken: "" }
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

export { registerVendor, loginVendor, logoutVendor };