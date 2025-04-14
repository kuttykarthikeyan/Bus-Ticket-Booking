import UserService from "../services/authServices/userService.js";
import User from "../models/userModel.js";
import {
  hashPassword,
  comparePassword,
  generateToken,
} from "../utils/authUtils.js";

jest.mock("../models/userModel.js", () => ({
  findOne: jest.fn(),
  create: jest.fn(),
}));

jest.mock("../utils/authUtils.js", () => ({
  hashPassword: jest.fn(),
  comparePassword: jest.fn(),
  generateToken: jest.fn(),
}));

const userService = new UserService();

describe("UserService - register", () => {
  const mockData = {
    name: "Test User",
    email: "test@example.com",
    phone: "1234567890",
    password: "test1234",
  };

  it("should return error if required fields are missing", async () => {
    const result = await userService.register({
      email: "test@example.com",
      password: "pass123",
    });

    expect(result.status).toBe(400);
    expect(result.success).toBe(false);
    expect(result.message).toBe("All fields are required");
  });

  it("should return error if user already exists", async () => {
    User.findOne.mockResolvedValue({ email: "test@example.com" });

    const result = await userService.register(mockData);

    expect(User.findOne).toHaveBeenCalledWith({ email: mockData.email });
    expect(result.status).toBe(400);
    expect(result.message).toBe("user already exists");
  });

  it("should register user if data is valid and unique", async () => {
    User.findOne.mockResolvedValue(null);
    hashPassword.mockResolvedValue("hashed_password");
    User.create.mockResolvedValue({ ...mockData, password: "hashed_password" });

    const result = await userService.register(mockData);

    expect(User.create).toHaveBeenCalled();
    expect(result.status).toBe(201);
    expect(result.success).toBe(true);
    expect(result.message).toBe("user registered successfully");
  });
});

describe("UserService - login", () => {
  const email = "test@example.com";
  const password = "test1234";

  it("should return error if email or password is missing", async () => {
    const result = await userService.login(null, null);

    expect(result.status).toBe(400);
    expect(result.success).toBe(false);
    expect(result.message).toBe("Email and password required");
  });

  it("should return error if user not found or password invalid", async () => {
    User.findOne.mockResolvedValue(null);

    const result = await userService.login(email, password);

    expect(User.findOne).toHaveBeenCalledWith({ email });
    expect(result.status).toBe(401);
    expect(result.success).toBe(false);
    expect(result.message).toBe("Invalid email or password");
  });

  it("should return token if credentials are correct", async () => {
    const fakeUser = { _id: "user123", email, password: "hashed_password" };

    User.findOne.mockResolvedValue(fakeUser);
    comparePassword.mockResolvedValue(true);
    generateToken.mockReturnValue("mocked_token");

    const result = await userService.login(email, password);

    expect(comparePassword).toHaveBeenCalledWith(password, "hashed_password");
    expect(generateToken).toHaveBeenCalledWith("user123", "user");
    expect(result.status).toBe(200);
    expect(result.success).toBe(true);
    expect(result.token).toBe("mocked_token");
  });
});
