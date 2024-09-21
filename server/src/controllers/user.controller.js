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

    // 400 - Bad Request if the role is invalid
    if (!validRoles.includes(role)) {
        throw new ApiError(400, "Invalid role");
    }

    // 400 - Bad Request if any field is missing
    if ([userName, role, fullName, email, password].some(field => field?.trim() === "")) {
        throw new ApiError(400, "All fields are required");
    }

    // Check if email or username is already taken
    const existingUserByEmail = await User.findOne({ email });
    const existingUserByUserName = await User.findOne({ userName: userName.toLowerCase() });

    // 409 - Conflict if the email is already taken
    if (existingUserByEmail) {
        throw new ApiError(409, "Email is already taken");
    }

    // 409 - Conflict if the username is already taken
    if (existingUserByUserName) {
        throw new ApiError(409, "Username is already taken");
    }

    try {
        // Create new user
        const user = await User.create({
            fullName,
            role,
            email,
            password,
            userName: userName.toLowerCase()
        });

        // Fetch user without password and refreshToken
        const createdUser = await User.findById(user._id).select("-password -refreshToken");

        // 500 - Internal Server Error if user is not properly created
        if (!createdUser) {
            throw new ApiError(500, "User registration failed");
        }

        // 201 - Created when user is successfully registered
        return res.status(201).json(new ApiResponse(201, createdUser, "User registered successfully"));
    } catch (error) {
        console.log("error while registering", error);
        // 500 - Internal Server Error if there was an issue during registration
        throw new ApiError(500, "User registration failed");
    }
});

const userLogin = asyncHandler(async (req, res) => {
    const { role, email, userName, password } = req.body;
    console.log(role, email, userName, password);

    // 400 - Bad Request if email is not provided
    if (!email) {
        throw new ApiError(400, "Email is required");
    }

    // Find user by email or username
    const user = await User.findOne({
        $or: [{ email }, { userName }]
    });

    // 404 - Not Found if user does not exist or the role is invalid
    if (!user) {
        throw new ApiError(404, "User not found");
    }

    // 403 - Forbidden if role is incorrect
    if (user.role !== role) {
        throw new ApiError(403, "Invalid role");
    }

    // Verify password
    const isPasswordCorrect = await user.isPasswordCorrect(password);
    
    // 401 - Unauthorized if password is incorrect
    if (!isPasswordCorrect) {
        throw new ApiError(401, "Incorrect password");
    }

    // Generate access and refresh tokens
    const { accessToken, refreshToken } = await generateAccessAndRefereshToken(user._id);
    console.log("accessToken login", "refreshAccessToken login", accessToken, refreshToken);

    // Fetch logged-in user without password and refreshToken
    const loggedInUser = await User.findById(user._id).select("-password -refreshToken");

    // 500 - Internal Server Error if the user cannot be fetched after login
    if (!loggedInUser) {
        throw new ApiError(500, "Logged-in user not found");
    }

    const options = {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production"
    };

    // 200 - OK if login is successful
    return res.status(200)
        .cookie("accessToken", accessToken, options)
        .cookie("refreshToken", refreshToken, options)
        .json(new ApiResponse(200, { user: loggedInUser, refreshToken, accessToken }, "User logged in successfully"));
});

const adminRegister = asyncHandler(async (req, res) => {
    const { adminSecretKey, userName, email, fullName, password } = req.body;

    // 403 - Forbidden if the admin secret key is incorrect
    if (adminSecretKey !== process.env.ADMIN_SECRET_KEY) {
        throw new ApiError(403, "Invalid admin secret key");
    }

    // 400 - Bad Request if any field is missing
    if ([userName, fullName, email, password].some(field => field?.trim() === "")) {
        throw new ApiError(400, "All fields are required");
    }

    // Check if email or username is already taken
    const existingAdminByEmail = await User.findOne({ email });
    const existingAdminByUserName = await User.findOne({ userName: userName.toLowerCase() });

    // 409 - Conflict if the email is already taken
    if (existingAdminByEmail) {
        throw new ApiError(409, "Email is already taken");
    }

    // 409 - Conflict if the username is already taken
    if (existingAdminByUserName) {
        throw new ApiError(409, "Username is already taken");
    }

    try {
        // Create the admin user
        const admin = await User.create({
            fullName,
            role: 'admin',  // Role is explicitly 'admin'
            email,
            password,
            userName: userName.toLowerCase()
        });

        // Fetch admin user without password and refreshToken
        const createdAdmin = await User.findById(admin._id).select("-password -refreshToken");

        // 500 - Internal Server Error if admin is not properly created
        if (!createdAdmin) {
            throw new ApiError(500, "Admin registration failed");
        }

        // 201 - Created when the admin is successfully registered
        return res.status(201).json(new ApiResponse(201, createdAdmin, "Admin registered successfully"));
    } catch (error) {
        console.log("Error during admin registration:", error);
        // 500 - Internal Server Error for registration failures
        throw new ApiError(500, "Admin registration failed");
    }
});

const adminLogin = asyncHandler(async (req, res) => {
    const { email, password } = req.body;

    // 400 - Bad Request if email or password is missing
    if (!email || !password) {
        throw new ApiError(400, "Email and password are required");
    }

    // Find the user by email
    const admin = await User.findOne({ email });

    // 403 - Forbidden if the user is not found or is not an admin
    if (!admin || admin.role !== 'admin') {
        throw new ApiError(403, "Access denied, admin only");
    }

    // Verify the password
    const isPasswordCorrect = await admin.isPasswordCorrect(password);
    
    // 400 - Bad Request if the password is incorrect
    if (!isPasswordCorrect) {
        throw new ApiError(400, "Incorrect password");
    }

    // Generate tokens
    const { accessToken, refreshToken } = await generateAccessAndRefereshToken(admin._id);

    // Fetch admin without sensitive information
    const loggedInAdmin = await User.findById(admin._id).select("-password -refreshToken");

    // 500 - Internal Server Error if the admin cannot be retrieved after login
    if (!loggedInAdmin) {
        throw new ApiError(500, "Admin login failed");
    }

    const options = {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
    };

    // 200 - OK, Admin successfully logged in
    return res.status(200)
        .cookie("accessToken", accessToken, options)
        .cookie("refreshToken", refreshToken, options)
        .json(new ApiResponse(200, { user: loggedInAdmin, refreshToken, accessToken }, "Admin logged in successfully"));
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

import asyncHandler from 'express-async-handler';
import { User } from '../models/user.model.js'; // Adjust the import according to your file structure
import ApiError from '../utils/ApiError.js'; // Adjust the import according to your error handling setup
import { uploadOnCloudinary } from '../utils/cloudinary.js'; // Function to upload images to Cloudinary

// Controller for editing user details
const editUser = asyncHandler(async (req, res) => {
    const userId = req.user._id; 
    const { userName, email, fullName, phoneNumber } = req.body;

    // Validate required fields
    if (!userName || !email || !fullName) {
        throw new ApiError(400, "User name, email, and full name are required");
    }

    // Check if email or username already exists
    const existingUser = await User.findOne({ 
        $or: [{ email }, { userName: userName.toLowerCase() }], 
        _id: { $ne: userId } // Exclude current user ID from check
    });

    if (existingUser) {
        throw new ApiError(400, "Email or username already in use");
    }

    // Prepare update data
    const updatedData = {
        userName: userName.toLowerCase(),
        email: email.toLowerCase(),
        fullName,
        phoneNumber,
    };

    // Handle image upload if provided
    if (req.file) {
        try {
            const imageOnCloudinary = await uploadOnCloudinary(req.file.path);
            updatedData.image = imageOnCloudinary.secure_url;
        } catch (error) {
            throw new ApiError(500, 'Error uploading image to Cloudinary');
        }
    }

    // Update user in the database
    const updatedUser = await User.findByIdAndUpdate(userId, updatedData, { new: true }).select('-password -refreshToken');

    if (!updatedUser) {
        throw new ApiError(404, "User not found");
    }

    return res.status(200).json({
        status: 200,
        data: updatedUser,
        message: "User details updated successfully",
    });
});


const getUser = asyncHandler(async (req, res) => {
    const user = req.user
    console.log(user)
    if (!user) {
        throw new ApiError(400, "user not found");
    }
    return res.status(200)
        .json(new ApiResponse(200, user, "User details fetched successfully"));
})

export { userRegister, userLogin, refreshAccessToken, logOutUser, adminRegister, adminLogin, getUser, editUser }