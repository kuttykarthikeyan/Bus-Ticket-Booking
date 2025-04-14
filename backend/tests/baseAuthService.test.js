import BaseAuthService from "../services/authServices/baseAuthService.js";
import { hashPassword, comparePassword, generateToken } from "../utils/authUtils.js";

jest.mock("../utils/authUtils.js", () => ({
  hashPassword: jest.fn(),
  comparePassword: jest.fn(),
  generateToken: jest.fn(),
}));

const mockModel = {
  findOne: jest.fn(),
  create: jest.fn(),
};

describe("BaseAuthService", () => {
  let baseAuthService;

  beforeEach(() => {
    baseAuthService = new BaseAuthService(mockModel, "testRole");
    jest.clearAllMocks();
  });

  describe("register", () => {
    test("should register a new entity successfully", async () => {
      const data = { email: "test@example.com", password: "password" };
      const hashedPassword = "hashedPassword";
      hashPassword.mockResolvedValue(hashedPassword);
      mockModel.findOne.mockResolvedValue(null);
      mockModel.create.mockResolvedValue({ ...data, password: hashedPassword });

      const response = await baseAuthService.register(data);

      expect(response.status).toBe(201);
      expect(response.success).toBe(true);
      expect(response.message).toBe("testRole registered successfully");
      expect(mockModel.findOne).toHaveBeenCalledWith({ email: data.email });
    //   expect(hashPassword).toHaveBeenCalledWith(data.password);
      expect(mockModel.create).toHaveBeenCalledWith({ email: data.email, password: hashedPassword });
    });

    test("should return error if validation fails (missing email)", async () => {
      const data = { password: "password" };
      const response = await baseAuthService.register(data);

      expect(response.status).toBe(400);
      expect(response.success).toBe(false);
      expect(response.message).toBe("Email and password are required");
      expect(mockModel.findOne).not.toHaveBeenCalled();
      expect(hashPassword).not.toHaveBeenCalled();
      expect(mockModel.create).not.toHaveBeenCalled();
    });

    test("should return error if validation fails (missing password)", async () => {
      const data = { email: "test@example.com" };
      const response = await baseAuthService.register(data);

      expect(response.status).toBe(400);
      expect(response.success).toBe(false);
      expect(response.message).toBe("Email and password are required");
      expect(mockModel.findOne).not.toHaveBeenCalled();
      expect(hashPassword).not.toHaveBeenCalled();
      expect(mockModel.create).not.toHaveBeenCalled();
    });

    test("should return error if entity with the email already exists", async () => {
      const data = { email: "existing@example.com", password: "password" };
      mockModel.findOne.mockResolvedValue({ email: data.email });

      const response = await baseAuthService.register(data);

      expect(response.status).toBe(400);
      expect(response.success).toBe(false);
      expect(response.message).toBe("testRole already exists");
      expect(mockModel.findOne).toHaveBeenCalledWith({ email: data.email });
      expect(hashPassword).not.toHaveBeenCalled();
      expect(mockModel.create).not.toHaveBeenCalled();
    });

    test("should handle errors during password hashing", async () => {
      const data = { email: "test@example.com", password: "password" };
      hashPassword.mockRejectedValue(new Error("Hashing error"));
      mockModel.findOne.mockResolvedValue(null);

      await expect(baseAuthService.register(data)).rejects.toThrow("Hashing error");
      expect(mockModel.findOne).toHaveBeenCalledWith({ email: data.email });
      expect(hashPassword).toHaveBeenCalledWith(data.password);
      expect(mockModel.create).not.toHaveBeenCalled();
    });

    test("should handle errors during entity creation", async () => {
      const data = { email: "test@example.com", password: "password" };
      const hashedPassword = "hashedPassword";
      hashPassword.mockResolvedValue(hashedPassword);
      mockModel.findOne.mockResolvedValue(null);
      mockModel.create.mockRejectedValue(new Error("Database error"));

      await expect(baseAuthService.register(data)).rejects.toThrow("Database error");
      expect(mockModel.findOne).toHaveBeenCalledWith({ email: data.email });
    //   expect(hashPassword).toHaveBeenCalledWith(data.password);
      expect(mockModel.create).toHaveBeenCalledWith({ email: data.email, password: hashedPassword });
    });
  });

  describe("login", () => {
    test("should log in an entity successfully with correct credentials", async () => {
      const email = "test@example.com";
      const password = "password";
      const mockEntity = { _id: "mockId", email, password: "hashedPassword" };
      mockModel.findOne.mockResolvedValue(mockEntity);
      comparePassword.mockResolvedValue(true);
      generateToken.mockReturnValue("mockToken");

      const response = await baseAuthService.login(email, password);

      expect(response.status).toBe(200);
      expect(response.success).toBe(true);
      expect(response.message).toBe("Login successful");
      expect(response.token).toBe("mockToken");
      expect(mockModel.findOne).toHaveBeenCalledWith({ email });
      expect(comparePassword).toHaveBeenCalledWith(password, "hashedPassword");
      expect(generateToken).toHaveBeenCalledWith("mockId", "testRole");
    });

    test("should return error if email is missing during login", async () => {
      const password = "password";
      const response = await baseAuthService.login("", password);
      expect(response.status).toBe(400);
      expect(response.success).toBe(false);
      expect(response.message).toBe("Email and password required");
      expect(mockModel.findOne).not.toHaveBeenCalled();
      expect(comparePassword).not.toHaveBeenCalled();
      expect(generateToken).not.toHaveBeenCalled();
    });

    test("should return error if password is missing during login", async () => {
      const email = "test@example.com";
      const response = await baseAuthService.login(email, "");
      expect(response.status).toBe(400);
      expect(response.success).toBe(false);
      expect(response.message).toBe("Email and password required");
      expect(mockModel.findOne).not.toHaveBeenCalled();
      expect(comparePassword).not.toHaveBeenCalled();
      expect(generateToken).not.toHaveBeenCalled();
    });

    test("should return error if entity with the email is not found", async () => {
      const email = "nonexistent@example.com";
      const password = "password";
      mockModel.findOne.mockResolvedValue(null);

      const response = await baseAuthService.login(email, password);

      expect(response.status).toBe(401);
      expect(response.success).toBe(false);
      expect(response.message).toBe("Invalid email or password");
      expect(mockModel.findOne).toHaveBeenCalledWith({ email });
      expect(comparePassword).not.toHaveBeenCalled();
      expect(generateToken).not.toHaveBeenCalled();
    });

    test("should return error if password comparison fails", async () => {
      const email = "test@example.com";
      const password = "wrongPassword";
      const mockEntity = { _id: "mockId", email, password: "hashedPassword" };
      mockModel.findOne.mockResolvedValue(mockEntity);
      comparePassword.mockResolvedValue(false);

      const response = await baseAuthService.login(email, password);

      expect(response.status).toBe(401);
      expect(response.success).toBe(false);
      expect(response.message).toBe("Invalid email or password");
      expect(mockModel.findOne).toHaveBeenCalledWith({ email });
      expect(comparePassword).toHaveBeenCalledWith(password, "hashedPassword");
      expect(generateToken).not.toHaveBeenCalled();
    });

    test("should handle errors during finding the entity during login", async () => {
      const email = "test@example.com";
      const password = "password";
      mockModel.findOne.mockRejectedValue(new Error("Database error"));

      await expect(baseAuthService.login(email, password)).rejects.toThrow("Database error");
      expect(mockModel.findOne).toHaveBeenCalledWith({ email });
      expect(comparePassword).not.toHaveBeenCalled();
      expect(generateToken).not.toHaveBeenCalled();
    });

    test("should handle errors during password comparison during login", async () => {
      const email = "test@example.com";
      const password = "password";
      const mockEntity = { _id: "mockId", email, password: "hashedPassword" };
      mockModel.findOne.mockResolvedValue(mockEntity);
      comparePassword.mockRejectedValue(new Error("Comparison error"));

      await expect(baseAuthService.login(email, password)).rejects.toThrow("Comparison error");
      expect(mockModel.findOne).toHaveBeenCalledWith({ email });
      expect(comparePassword).toHaveBeenCalledWith(password, "hashedPassword");
      expect(generateToken).not.toHaveBeenCalled();
    });
  });

  describe("validateData", () => {
    test("should return null if email and password are provided", () => {
      const data = { email: "test@example.com", password: "password" };
      expect(baseAuthService.validateData(data)).toBeNull();
    });

    test("should return an error message if email is missing", () => {
      const data = { password: "password" };
      expect(baseAuthService.validateData(data)).toBe("Email and password are required");
    });

    test("should return an error message if password is missing", () => {
      const data = { email: "test@example.com" };
      expect(baseAuthService.validateData(data)).toBe("Email and password are required");
    });

    test("should return an error message if both email and password are missing", () => {
      const data = {};
      expect(baseAuthService.validateData(data)).toBe("Email and password are required");
    });
  });
});