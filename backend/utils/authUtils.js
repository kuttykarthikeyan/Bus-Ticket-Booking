import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

const hashPassword = async (password) => bcrypt.hash(password, 10);

const comparePassword = async (password, hashedPassword) => bcrypt.compare(password, hashedPassword);

const generateToken = (userId, role) => jwt.sign({ id: userId, role }, "mysecretkey", { expiresIn: "2d" });

const verifyToken = (token) => {
    try {
        return jwt.verify(token, "mysecretkey");
    } catch (error) {
        throw new Error("Invalid token");
    }
};

export { hashPassword, comparePassword, generateToken, verifyToken };
