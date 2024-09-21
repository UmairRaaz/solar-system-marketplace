import { asyncHandler } from "../utils/asyncHandler.js"
import { ApiError } from "../utils/apiError.js";
import { ApiResponse } from "../utils/apiResponse.js";
import { User } from "../models/user.models.js";
import { deleteFromCloudinary, uploadOnCloudinary } from "../utils/cloudinary.js";
import jwt from "jsonwebtoken"
const generateAccessAndRefereshToken = async (userId) => {
    try {
        const user = await User.findById(userId)
        if (!user) {
            throw new ApiError(400, "user not found")
        }
        const accessToken = await user.generateAccessToken()
        const refreshToken = await user.generateRefreshToken()
        // console.log("accesstoken", accessToken)
        // console.log("refreshToken", refreshToken)
        user.refreshToken;
        await user.save({ validateBeforeSave: true })

        return { accessToken, refreshToken }
    } catch (error) {
        console.log("error while generating token", error)
        throw new ApiError(500, "error generating token")
    }
}


const userRegister = asyncHandler(async (req, res) => {
    const { role, userName, email, fullName, password } = req.body;
    const validRoles = ['user', 'seller'];
    if (!validRoles.includes(role)) {
        throw new ApiError(400, "Invalid role");
    }

    if ([userName, role, fullName, email, password].some(field => field?.trim() === "")) {
        throw new ApiError(400, "All fields are required");
    }

    const existingUser = await User.findOne({
        $or: [{ email }, { userName }]
    });

    if (existingUser) {
        throw new ApiError(400, "User already registered");
    }

    try {
        const user = await User.create({
            fullName,
            role,
            email,
            password,
            userName: userName.toLowerCase()
        });

        const createdUser = await User.findById(user._id).select("-password -refreshToken");

        if (!createdUser) {
            throw new ApiError(500, "User registration failed");
        }

        return res.status(200).json(new ApiResponse(200, createdUser, "User registered successfully"));
    } catch (error) {
        console.log("error while registrating", error)
        throw new ApiError(500, "User registration failed");
    }
});
const adminRegister = asyncHandler(async (req, res) => {
    const { adminSecretKey, userName, email, fullName, password } = req.body;


    if (adminSecretKey !== process.env.ADMIN_SECRET_KEY) {
        throw new ApiError(403, "Invalid admin secret key");
    }

    if ([userName, fullName, email, password].some(field => field?.trim() === "")) {
        throw new ApiError(400, "All fields are required");
    }

    const existingAdmin = await User.findOne({
        $or: [{ email }, { userName }]
    });

    if (existingAdmin) {
        throw new ApiError(400, "Admin already registered");
    }

    try {
        const admin = await User.create({
            fullName,
            role: 'admin', 
            email,
            password,
            userName: userName.toLowerCase()
        });

        const createdAdmin = await User.findById(admin._id).select("-password -refreshToken");

        if (!createdAdmin) {
            throw new ApiError(500, "Admin registration failed");
        }

        return res.status(200).json(new ApiResponse(200, createdAdmin, "Admin registered successfully"));
    } catch (error) {
        throw new ApiError(500, "Admin registration failed");
    }
});
const adminLogin = asyncHandler(async (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
        throw new ApiError(400, "Email and password are required");
    }

    // Find the user by email
    const admin = await User.findOne({ email });

    // Check if the user exists and if their role is 'admin'
    if (!admin || admin.role !== 'admin') {
        throw new ApiError(403, "Access denied, admin only");
    }

    // Verify the password
    const isPasswordCorrect = await admin.isPasswordCorrect(password);
    if (!isPasswordCorrect) {
        throw new ApiError(400, "Incorrect password");
    }

    // Generate tokens
    const { accessToken, refreshToken } = await generateAccessAndRefereshToken(admin._id);

    // Exclude sensitive information from the response
    const loggedInAdmin = await User.findById(admin._id).select("-password -refreshToken");

    if (!loggedInAdmin) {
        throw new ApiError(500, "Admin login failed");
    }

    const options = {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
    };

    // Send response with tokens
    return res.status(200)
        .cookie("accessToken", accessToken, options)
        .cookie("refreshToken", refreshToken, options)
        .json(new ApiResponse(200, { user: loggedInAdmin, refreshToken, accessToken }, "Admin logged in successfully"));
});


const userLogin = asyncHandler(async (req, res) => {
    const { role, email, userName, password } = req.body;
    console.log(role, email, userName, password)
    if (!email) {
        throw new ApiError(400, "Email is required");
    }

    const user = await User.findOne({
        $or: [{ email }, { userName }]
    });

    if (!user || user.role !== role) {
        throw new ApiError(400, "User not found or invalid role");
    }

    const isPasswordCorrect = await user.isPasswordCorrect(password);
    if (!isPasswordCorrect) {
        throw new ApiError(400, "Incorrect password");
    }

    const { accessToken, refreshToken } = await generateAccessAndRefereshToken(user._id);
    console.log("accessToken login", "refreshAccessToken login", accessToken, refreshToken)
    const loggedInUser = await User.findById(user._id).select("-password -refreshToken");

    if (!loggedInUser) {
        throw new ApiError(500, "Logged in user not found");
    }

    const options = {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production"
    };

    return res.status(200)
        .cookie("accessToken", accessToken, options)
        .cookie("refreshToken", refreshToken, options)
        .json(new ApiResponse(200, { user: loggedInUser, refreshToken, accessToken }, "User logged in successfully"));
});

const refreshAccessToken = asyncHandler(async (req, res) => {
    const inComingRefreshToken = req.cookies.refreshToken || req.body.refreshToken;

    if (!inComingRefreshToken) {
        throw new ApiError(401, "Refresh Token not found")
    }

    try {
        const decodedToken = await jwt.verify(refreshAccessToken, process.env.RefreshTokenSecret)

        const user = await User.findById(decodedToken?._id)

        if (!user) {
            throw new ApiError(401, "Invalid Refresh Token")
        }

        if (inComingRefreshToken !== user?.refreshToken) {
            throw new ApiError(401, "Refresh token expired")
        }

        const options = {
            http: true,
            secure: process.env.NODE_ENV === "production"
        }

        const generatedTokens = await generateAccessAndRefereshToken(user._id)
        const { accessToken, refreshToken: newRefereshToken } = generatedTokens;

        return res.status(200)
            .cookie("accessToken", accessToken, options)
            .cookie("refreshToken", newRefereshToken, options)
            .json(new ApiResponse(200, { accessToken, refreshToken: newRefereshToken }, "access token refreshed successfully"))
    } catch (error) {
        console.log("error while new refresh token", error)
        throw new ApiError(500, "error while new refresh token")
    }
});

const logOutUser = asyncHandler(async (req, res) => {
    await User.findByIdAndUpdate(
        req.user._id,
        {
            $set: {
                refreshToken: undefined
            }
        }, {
        new: true
    }
    )
    const options = {
        http: true,
        secure: process.env.NODE_ENV === "production"
    }

    return res.status(200)
        .clearCookie("accessToken", options)
        .clearCookie("refreshToken", options)
        .json(new ApiResponse(200, "user logout successfully"))
})


const getUser = asyncHandler(async (req, res) => {
    const user = req.user
    console.log(user)
    if (!user) {
        throw new ApiError(400, "user not found");
    }
    return res.status(200)
        .json(new ApiResponse(200, user, "User details fetched successfully"));
})

export { userRegister, userLogin, refreshAccessToken, logOutUser, adminRegister, adminLogin, getUser }