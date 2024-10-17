import { Buyer } from '../models/buyer.model.js';
import { Seller } from '../models/seller.model.js';
import { ApiError } from '../utils/ApiError.js';
import { ApiResponse } from '../utils/ApiResponse.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import { generateAccessAndRefreshToken } from '../utils/generateTokens.js';
import { options } from '../constants.js';


// Register a new buyer
const registerBuyer = asyncHandler(async (req, res) => {
    const { fullName, userName, email, password } = req.body;

    // Check if buyer or seller  with the same email or username already exists
    const existingBuyer = await Buyer.findOne({
        $or: [{ email }, { userName }]
    });

    const existingSeller = await Seller.findOne({
        $or: [{ email }, { userName }]
    });

    if (existingBuyer || existingSeller) {
        throw new ApiError(409, "User with this email or username already exists");
    }


    // Create a new buyer instance
    const buyer = await Buyer.create({
        fullName,
        userName: userName.toLowerCase(),
        email,
        password
    })


    // Retrieve created buyer without sensitive fields
    const createdBuyer = await Buyer.findById(buyer._id).select("-password");

    if (!createdBuyer) {
        throw new ApiError(500, "Buyer registration failed");
    }
    else {
        res.status(201).json(new ApiResponse(201, createdBuyer, "Buyer registered successfully"));
    }

})


const loginBuyer = asyncHandler(async (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
        throw new ApiError(400, "Email and password are required.");
    }

    const buyer = await Buyer.findOne({ email });

    if (!buyer) {
        throw new ApiError(404, "Buyer does not exist. Please register.");
    }

    const isPasswordValid = await buyer.isPasswordCorrect(password);

    if (!isPasswordValid) {
        throw new ApiError(400, "Invalid email or password");
    }


    const { accessToken, refreshToken } = await generateAccessAndRefreshToken(buyer._id, Buyer);

    const loggedInBuyer = await Buyer.findById(buyer._id).select("-password -refreshToken");


    return res.status(200)
        .cookie("accessToken", accessToken, options)
        .cookie("refreshToken", refreshToken, options)
        .json(new ApiResponse(
            200,
            {
                buyer: loggedInBuyer,
                accessToken,
                refreshToken
            },
            "Logged in successfully."
        ));







});


const logoutBuyer = asyncHandler(async (req, res) => {
    const buyer = await Buyer.findByIdAndUpdate(
        req.user._id,
        {
            $set: { refreshToken: undefined }
        },
        { new: true } //Return the updated document
    );

    return res.status(200)
        .clearCookie("accessToken", options)
        .clearCookie("refreshToken", options)
        .json(new ApiResponse(200, {}, "Logged out successfully"));
});


export { registerBuyer, loginBuyer ,logoutBuyer};

