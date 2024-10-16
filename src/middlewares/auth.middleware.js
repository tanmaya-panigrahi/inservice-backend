import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import jwt from "jsonwebtoken";
import { Seller } from "../models/seller.model.js";

export const verifyJWT = asyncHandler(async (req, res, next) => {
    try {
        const token = req.cookies?.accessToken
            || req.headers["authorization"]?.replace("Bearer ", "");

        // console.log(token);

        if (!token) {
            throw new ApiError(401, "Unauthorized request");
        }

        const decodedInformation = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);

        const seller = await Seller.findById(decodedInformation?._id)
            .select("-password -refreshToken");

        if (!seller) {
            throw new ApiError(401, "Invalid Access Token");
        }

        req.seller = seller;
        next();
    } catch (error) {
        throw new ApiError(401, error?.message || "Invalid Access Token");
    }
});