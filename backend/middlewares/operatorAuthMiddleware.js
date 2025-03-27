import Operator from "../models/operatorModel.js";
import { verifyToken } from "../utils/authUtils.js";


export const operatorAuthMiddleware = async (req, res, next) => {
    try {
        const authHeader = req.headers.authorization;
        
        if (!authHeader || !authHeader.startsWith("Bearer ")) {
            return res.status(401).json({ success: false, message: "Access Denied: No token provided" });
        }

        const token = authHeader.split(" ")[1];
        const decoded = await verifyToken(token); 
        const user = await Operator.findById(decoded.id).select("-password"); 
        if (!decoded || !decoded.id) {
            return res.status(401).json({ success: false, message: "Invalid token: Operator ID missing" });
        }

        req.user = user;
        next();

    } catch (error) {
        console.error("Error in operatorAuthMiddleware:", error);
        return res.status(401).json({ success: false, message: "Invalid Token", error: error.message });
    }
};

