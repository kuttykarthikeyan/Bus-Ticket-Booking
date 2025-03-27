import jwt from "jsonwebtoken";
import User from "../models/userModel.js";

const authMiddleware = async (req, res, next) => {
    try {
        const token = req.headers.authorization?.split(" ")[1]; 

        if (!token) {
            return res.status(401).json({ success: false, message: "Unauthorized: No token provided" });
        }

        const decoded = jwt.verify(token,"mysecretkey" ); 
        const user = await User.findById(decoded.id).select("-password"); 

        if (!user) {
            return res.status(401).json({ success: false, message: "Unauthorized: User not found" });
        }

        req.user = user; 
        
        next();
    } catch (error) {
        return res.status(401).json({ success: false, message: "Unauthorized: Invalid token" });
    }
};

export { authMiddleware };
