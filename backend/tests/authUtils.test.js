import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { hashPassword, comparePassword, generateToken, verifyToken, handleError } from "../utils/authUtils";

jest.mock("bcryptjs");
jest.mock("jsonwebtoken");

describe("Auth Utils", () => {
  describe("hashPassword", () => {
    it("should hash a password", async () => {
      const password = "password123";
      const hashedPassword = "hashedpassword123";
      
      bcrypt.hash.mockResolvedValue(hashedPassword);
      
      const result = await hashPassword(password);
      
      expect(bcrypt.hash).toHaveBeenCalledWith(password, 10);
      expect(result).toBe(hashedPassword);
    });
  });
  
  // Tests for comparePassword
  describe("comparePassword", () => {
    it("should return true for matching passwords", async () => {
      const password = "password123";
      const hashedPassword = "hashedpassword123";
      
      bcrypt.compare.mockResolvedValue(true);
      
      const result = await comparePassword(password, hashedPassword);
      
      expect(bcrypt.compare).toHaveBeenCalledWith(password, hashedPassword);
      expect(result).toBe(true);
    });
    
    it("should return false for non-matching passwords", async () => {
      const password = "wrongpassword";
      const hashedPassword = "hashedpassword123";
      
      bcrypt.compare.mockResolvedValue(false);
      
      const result = await comparePassword(password, hashedPassword);
      
      expect(bcrypt.compare).toHaveBeenCalledWith(password, hashedPassword);
      expect(result).toBe(false);
    });
  });
  
  // Tests for generateToken
  describe("generateToken", () => {
    it("should generate a JWT token", () => {
      const userId = "user123";
      const role = "user";
      const token = "generatedToken";
      
      jwt.sign.mockReturnValue(token);
      
      const result = generateToken(userId, role);
      
      expect(jwt.sign).toHaveBeenCalledWith(
        { id: userId, role }, 
        "mysecretkey", 
        { expiresIn: "2d" }
      );
      expect(result).toBe(token);
    });
  });
  
  // Tests for verifyToken - currently at 0% coverage
  describe("verifyToken", () => {
    it("should verify a valid token", () => {
      const token = "validToken";
      const decoded = { id: "user123", role: "user" };
      
      jwt.verify.mockReturnValue(decoded);
      
      const result = verifyToken(token);
      
      expect(jwt.verify).toHaveBeenCalledWith(token, "mysecretkey");
      expect(result).toEqual(decoded);
    });
    
    it("should throw an error for invalid token", () => {
      const token = "invalidToken";
      
      jwt.verify.mockImplementation(() => {
        throw new Error("jwt malformed");
      });
      
      expect(() => verifyToken(token)).toThrow("Invalid token");
      expect(jwt.verify).toHaveBeenCalledWith(token, "mysecretkey");
    });
  });
  
  // Tests for handleError - currently at 0% coverage
  describe("handleError", () => {
    it("should return a 500 response with error details", () => {
      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn()
      };
      const error = new Error("Database error");
      const message = "Failed to create user";
      
      // Spy on console.error
      const consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation();
      
      handleError(res, error, message);
      
      expect(consoleErrorSpy).toHaveBeenCalledWith(`${message}:`, error);
      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({
        success: false,
        message: message,
        error: error.message
      });
      
      // Restore console.error
      consoleErrorSpy.mockRestore();
    });
  });
});