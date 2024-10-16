import { Seller } from "../models/seller.model.js";
import { ApiError } from "./ApiError.js";

const generateAccessAndRefreshToken = async (userId) => {
    try {
        const seller = await Seller.findById(userId);

        if (!seller) {
            throw new ApiError(404, "Seller not found");
        };
        
        const accessToken = await seller.generateAccessToken();
        const refreshToken = await seller.generateRefreshToken();

        seller.refreshToken = refreshToken;
        await seller.save({ validateBeforeSave: false });

        return { accessToken, refreshToken };

    } catch (error) {
        throw new ApiError(500, "Token generation failed");
    }
};

export { generateAccessAndRefreshToken };