import jwt from "jsonwebtoken"
import { User } from "../models/user.models.js"; 
import { ApiError } from "../utils/apiError.js"; 

import { asyncHandler } from "../utils/asyncHandler.js"; 


const verifyJWT = asyncHandler(async (req, _, next) => {
    console.log(req.cookies)
    const token = await req.cookies.accessToken 
 
    // console.log("Token received:", token);

    if (!token) {
        throw new ApiError(400, "Token not found");
    }

    try {
        // Verify the token
        const decodedToken = jwt.verify(token, process.env.AccessTokenSecret);

        const user = await User.findById(decodedToken?._id).select("-password -refreshToken");

        if (!user) {
            throw new ApiError(400, "Unauthorized");
        }

        req.user = user;

        next();
    } catch (error) {
        console.log("Error while auth middleware", error);
        throw new ApiError(400, "Error while auth middleware");
    }
});

export {verifyJWT}