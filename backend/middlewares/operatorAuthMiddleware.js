import { verifyToken } from "../utils/authUtils.js";

export const operatorAuthMiddleware = async (req, res, next) => {
    try {
        if (!req.headers.authorization || !req.headers.authorization.startsWith("Bearer ")) {
            return res.status(401).json({ message: "Access Denied: No token provided" });
        }

        const token = req.headers.authorization.split(" ")[1];

        const decoded = await verifyToken(token);
        console.log("Decoded Token:", decoded);

        req.user = decoded;

        next();
    } catch (error) {
        console.error("Error in operatorAuthMiddleware:", error);
        return res.status(401).json({ message: "Invalid Token", error: error.message });
    }
};
