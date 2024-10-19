import { Client } from '../models/client.model.js';
import { Vendor } from '../models/vendor.model.js';
import { ApiError } from '../utils/ApiError.js';
import { ApiResponse } from '../utils/ApiResponse.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import { generateAccessAndRefreshToken } from '../utils/generateTokens.js';
import { options } from '../constants.js';


// Register a new client
const registerClient = asyncHandler(async (req, res) => {
    const { fullName, userName, email, password,location } = req.body;

    // Check if client or Vendor  with the same email or username already exists
    const existingClient = await Client.findOne({
        $or: [{ email }, { userName }]
    });

    const existingVendor = await Vendor.findOne({
        $or: [{ email }, { userName }]
    });

    if (existingClient || existingVendor) {
        throw new ApiError(409, "User with this email or username already exists");
    }


    // Create a new client instance
    const client = await Client.create({
        fullName,
        userName: userName.toLowerCase(),
        email,
        password,
        location
    })


    // Retrieve created client without sensitive fields
    const createdClient = await Client.findById(client._id).select("-password");

    if (!createdClient) {
        throw new ApiError(500, "Client registration failed");
    }
    else {
        res.status(201).json(new ApiResponse(201, createdClient, "Client registered successfully"));
    }

})


const loginClient = asyncHandler(async (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
        throw new ApiError(400, "Email and password are required.");
    }

    const client = await Client.findOne({ email });

    if (!client) {
        throw new ApiError(404, "Client does not exist. Please register.");
    }

    const isPasswordValid = await client.isPasswordCorrect(password);

    if (!isPasswordValid) {
        throw new ApiError(400, "Invalid email or password");
    }


    const { accessToken, refreshToken } = await generateAccessAndRefreshToken(client._id, Client);

    const loggedInClient = await Client.findById(client._id).select("-password -refreshToken");


    return res.status(200)
        .cookie("accessToken", accessToken, options)
        .cookie("refreshToken", refreshToken, options)
        .json(new ApiResponse(
            200,
            {
                client: loggedInClient,
                accessToken,
                refreshToken
            },
            "Logged in successfully."
        ));







});


const logoutClient= asyncHandler(async (req, res) => {
    const client = await Client.findByIdAndUpdate(
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


export { registerClient, loginClient ,logoutClient};

