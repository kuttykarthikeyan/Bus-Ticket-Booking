import jwt from "jsonwebtoken";
import User from "../models/userModel.js";
import dotenv from "dotenv";
dotenv.config(); 

const authMiddleware = async (req, res, next) => {
    try {
        const token = req.headers.authorization?.split(" ")[1];

        if (!token) {
            return res.status(401).json({
                success: false,
                status: 401,
                message: "Unauthorized: No token provided"
            });
        }
     
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const user = await User.findById(decoded.id).select("-password");

        if (!user) {
            return res.status(401).json({
                success: false,
                status: 401,
                message: "Unauthorized: User not found"
            });
        }

        req.user = user;
        next();
    } catch (error) {
        console.error("Error in authMiddleware:", error);
        return res.status(500).json({
            success: false,
            status: 500,
            message: "Internal Server Error: Authentication failed",
            error: error.message
        });
    }
};

export { authMiddleware };
