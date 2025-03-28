import Operator from "../models/operatorModel.js";
import { verifyToken } from "../utils/authUtils.js";

export const operatorAuthMiddleware = async (req, res, next) => {
    try {
        const authHeader = req.headers.authorization;

        if (!authHeader || !authHeader.startsWith("Bearer ")) {
            return res.status(401).json({
                success: false,
                status: 401,
                message: "Access Denied: No token provided"
            });
        }

        const token = authHeader.split(" ")[1];
        const decoded = await verifyToken(token);

        if (!decoded || !decoded.id) {
            return res.status(401).json({
                success: false,
                status: 401,
                message: "Invalid token: Operator ID missing"
            });
        }

        const user = await Operator.findById(decoded.id).select("-password");

        if (!user) {
            return res.status(404).json({
                success: false,
                status: 404,
                message: "Operator not found"
            });
        }

        req.user = user;
        next();
    } catch (error) {
        console.error("Error in operatorAuthMiddleware:", error);
        return res.status(500).json({
            success: false,
            status: 500,
            message: "Internal Server Error: Authentication failed",
            error: error.message
        });
    }
};
