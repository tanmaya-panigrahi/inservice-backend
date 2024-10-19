import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import jwt from "jsonwebtoken";
import { Vendor } from "../models/vendor.model.js";
import {Client } from "../models/client.model.js";

export const verifyJWT =(Model) =>asyncHandler(async (req, res, next) => {
    try {
        const token = req.cookies?.accessToken
            || req.headers["authorization"]?.replace("Bearer ", "");

        // console.log(token);

        if (!token) {
            throw new ApiError(401, "Unauthorized request");
        }

        const decodedInformation = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);

        const user= await Model.findById(decodedInformation?._id)
            .select("-password -refreshToken");

        if (!user) {
            throw new ApiError(401, "Invalid Access Token");
        }

        req.user = user;
        next();
    } catch (error) {
        throw new ApiError(401, error?.message || "Invalid Access Token");
    }
});