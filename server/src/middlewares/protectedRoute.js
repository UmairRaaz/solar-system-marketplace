import { User } from "../models/user.models";

const protectRoute = asyncHandler(async (req, res, next) => {
    const token = req.cookies.accessToken;
    
    if (!token) {
        throw new ApiError(401, "Not authorized, no token");
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
    const user = await User.findById(decoded.id).select("-password");

    if (!user) {
        throw new ApiError(401, "User not found");
    }

    req.user = user;
    next();
});

export {protectRoute}