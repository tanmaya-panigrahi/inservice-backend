import { Seller } from "../models/seller.model.js";
import { Buyer } from "../models/buyer.model.js";
import { ApiError } from "./ApiError.js";

const generateAccessAndRefreshToken = async (userId, Model) => {
    try {
        // const seller = await Seller.findById(userId);
        const user = await Model.findById(userId);

        console.log("user", user);

        if (!user) {
            throw new ApiError(404, "User not found");
        };
        
        const accessToken = await user.generateAccessToken();
        const refreshToken = await user.generateRefreshToken();
        // console.log("refreshToken", refreshToken);
        // console.log("accessToken", accessToken);

        user.refreshToken = refreshToken;
        await user.save({ validateBeforeSave: false });
        
        return { accessToken, refreshToken };

    } catch (error) {
        throw new ApiError(500, "Token generation failed");
    }
};

export { generateAccessAndRefreshToken };