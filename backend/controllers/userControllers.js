import { User } from "../models/userModel.js";
import { hashPassword, comparePassword, generateToken } from "../utils/authUtils.js";

export const registerUser = async (req, res) => {
    try {
        const { name, email, phone, password ,role} = req.body;

        if (!name || !email || !phone || !password || !role) {
            return res.status(400).json({ message: "All fields are required" });
        }

        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ message: "User already exists" });
        }

        const hashedPassword = await hashPassword(password);

        const newUser = new User({
            name,
            email,
            phone,
            password: hashedPassword, 
            role:role, 
        });

        await newUser.save();

        return res.status(201).json({ message: "User registered successfully" });
    } catch (error) {
        console.error("Error in registerUser:", error);
        return res.status(500).json({ message: "Internal Server Error", error: error.message });
    }
};

export const loginUser = async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({ message: "Email and password are required" });
        }

        const user = await User.findOne({ email });
        if (!user) {
            return res.status(401).json({ message: "Invalid email or password" });
        }

        const isPasswordValid = await comparePassword(password, user.password);
        if (!isPasswordValid) {
            return res.status(401).json({ message: "Invalid email or password" });
        }

        const token = generateToken(user._id, user.role);

        return res.status(200).json({
            message: "User logged in successfully",
            token,
        });

    } catch (error) {
        console.error("Error in loginUser:", error);
        return res.status(500).json({ message: "Internal Server Error", error: error.message });
    }
};
