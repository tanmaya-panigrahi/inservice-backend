import { Client } from '../models/client.model.js';
import { Vendor } from '../models/vendor.model.js';
import { Request } from '../models/request.model.js';
import { ApiError } from '../utils/ApiError.js';
import { ApiResponse } from '../utils/ApiResponse.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import { generateAccessAndRefreshToken } from '../utils/generateTokens.js';
import { options } from '../constants.js';
import pusher from '../utils/pusher.js';


// Register a new client
const registerClient = asyncHandler(async (req, res) => {

    console.log(req.body.filteredData);

    const { fullName, email, password } = req.body.filteredData;

    // Check if client or Vendor  with the same email or username already exists
    const existingClient = await Client.findOne({email});

    const existingVendor = await Vendor.findOne({ email });

    if (existingClient || existingVendor) {
        throw new ApiError(409, "User with this email already exists");
    }


    // Create a new client instance
    const client = await Client.create({
        fullName,
        email,
        password,

    })

    // Retrieve created client without sensitive fields
    const createdClient = await Client.findById(client._id).select("-password");

    if (!createdClient) {
        throw new ApiError(500, "Client registration failed");
    }
    else {
        return res.status(201).json(new ApiResponse(201, createdClient, "Client registered successfully"));
    }

})


const loginClient = asyncHandler(async (req, res) => {
    const { email, password } = req.body.filteredData;

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


    return res.status(201)
        .cookie("accessToken", accessToken, options)
        .cookie("refreshToken", refreshToken, options)
        .json(new ApiResponse(
            201,
            {
                client: loggedInClient,
                accessToken,
                refreshToken
            },
            "Logged in successfully."
        ));







});


const logoutClient = asyncHandler(async (req, res) => {
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


const requestCreation = asyncHandler(async (req, res) => {

    const { contractTitle, contractDescription, paymentType, hourlyRate, fixedPrice, startDate, requestImage, vendorId, status } = req.body;
    const clientId ="64a7b9f1f1d2b4a3c8e5e9d1";



    const request = await Request.create({
        contractTitle,
        contractDescription,
        paymentType,
        hourlyRate,
        fixedPrice,
        startDate,
        requestImage,
        clientId,
        vendorId,
        status
    });

    


    // Now, add the request ID to the client's `requests` array
    await Client.findByIdAndUpdate(clientId, {
        $push: { requests: request._id }  // Push the new request's ID to the `requests` array
    });

    // Now, add the request ID to the vendor's `requestReceived` array
    await Vendor.findByIdAndUpdate(vendorId, {
        $push: { requestReceived: request._id }  // Push the new request's ID to the `requestReceived` array
    });

    if (!request) {
        throw new ApiError(500, "Request creation failed");
    }
    else {
        pusher.trigger('requests', 'new-request', {
            requestId: request._id,
            clientId: request.clientId,
            vendorId: request.vendorId,
            contractTitle: request.contractTitle,
            contractDescription: request.contractDescription,
            paymentType: request.paymentType,
            hourlyRate: request.hourlyRate,
            fixedPrice: request.fixedPrice,
            startDate: request.startDate,
            requestImage: request.requestImage,
            status: request.status,
            
        });
        
        res.status(201).json(new ApiResponse(201, request, "Request created successfully"));
    }






})



const requestUpdation = asyncHandler(async (req, res) => {
    const requestId = req.params.id;
    const { requestTitle, requestDescription, requestImage, status, category, budget, attachments } = req.body;

    const request = await Request.findByIdAndUpdate
        (requestId, {
            requestTitle,
            requestDescription,
            requestImage,
            status,
            category,
            budget,
            attachments
        }, { new: true });

    if (!request) {
        throw new ApiError(500, "Request updation failed");
    }
    else {
        res.status(200).json(new ApiResponse(200, request, "Request updated successfully"));
    }


})

export { registerClient, loginClient, logoutClient, requestCreation };

