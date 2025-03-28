const adminMiddleware = (req, res, next) => {
    if (!req.user || req.user.role !== "admin") {
        return res.status(403).json({
            success: false,
            status: 403,
            message: "Access denied: Admins only"
        });
    }
    next();
};

export { adminMiddleware };
