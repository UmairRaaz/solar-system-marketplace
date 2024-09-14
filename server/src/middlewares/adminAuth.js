const adminAuth = (req, res, next) => {
    if (req.user.role !== 'admin') {
        return res.status(403).json(new ApiError(403, "Access denied, admin only."));
    }
    next();
};

export {adminAuth}