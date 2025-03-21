import { Operator } from "../models/operatorModel.js";
import { hashPassword, comparePassword, generateToken } from "../utils/authUtils.js";

export const registerOperator = async (req, res) => {
    try {
        const { company_name, email, phone, password } = req.body;

        if (!company_name || !email || !phone || !password) {
            return res.status(400).json({ message: "All fields are required" });
        }

        const existingOperator = await Operator.findOne({ email });
        if (existingOperator) {
            return res.status(400).json({ message: "Operator already exists" });
        }

        const hashedPassword = await hashPassword(password);

        const newOperator = new Operator({
            company_name,
            email,
            phone,
            password: hashedPassword,  
            verification_status: "pending",
        });

        await newOperator.save();

        return res.status(201).json({ message: "Operator registered successfully" });
    } catch (error) {
        console.error("Error in registerOperator:", error);
        return res.status(500).json({ message: "Internal Server Error", error: error.message });
    }
};

export const loginOperator = async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({ message: "Email and password are required" });
        }

        const operator = await Operator.findOne({ email });
        if (!operator) {
            return res.status(401).json({ message: "Invalid email or password" });
        }

        const isPasswordValid = await comparePassword(password, operator.password);
        if (!isPasswordValid) {
            return res.status(401).json({ message: "Invalid email or password" });
        }

        const token = generateToken(operator._id, "operator");

        return res.status(200).json({
            message: "Operator logged in successfully",
            token,
        });

    } catch (error) {
        console.error("Error in loginOperator:", error);
        return res.status(500).json({ message: "Internal Server Error", error: error.message });
    }
};
