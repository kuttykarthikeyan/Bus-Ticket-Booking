import OperatorService from "../services/authServices/operatorService.js";
import Operator from "../models/operatorModel.js";
import { hashPassword, comparePassword, generateToken } from "../utils/authUtils.js";


jest.mock("../models/operatorModel.js");
jest.mock("../utils/authUtils.js");

describe("OperatorService", () => {
  let operatorService;

  beforeEach(() => {
    operatorService = new OperatorService();
    jest.clearAllMocks(); 
  });

  describe("register", () => {
    test("should register an operator successfully", async () => {
      const data = {
        company_name: "Company A",
        email: "karthi@mail.com",
        phone: "1234567890",
        password: "test",  
      };

      Operator.findOne.mockResolvedValue(null); 
      hashPassword.mockResolvedValue("hashedPassword");
      Operator.create.mockResolvedValue(data);

      const response = await operatorService.register(data);

      expect(response.status).toBe(201);
      expect(response.success).toBe(true);
      expect(response.message).toBe("operator registered successfully");
      expect(Operator.findOne).toHaveBeenCalledWith({ email: data.email });
    });

    test("should return error if operator already exists", async () => {
      const data = {
        company_name: "Company A",
        email: "karthi@mail.com", 
        phone: "1234567890",
        password: "test",  
      };

      Operator.findOne.mockResolvedValue({ email: data.email });

      const response = await operatorService.register(data);

      expect(response.status).toBe(400);
      expect(response.success).toBe(false);
      expect(response.message).toBe("operator already exists");
      expect(Operator.findOne).toHaveBeenCalledWith({ email: data.email });
    });

    test("should return error if required fields are missing", async () => {
      const data = { email: "karthi@mail.com" }; 

      const response = await operatorService.register(data);

      expect(response.status).toBe(400);
      expect(response.success).toBe(false);
      expect(response.message).toBe("All fields are required");
    });
  });

  describe("login", () => {
    test("should login successfully with correct credentials", async () => {
      const email = "karthi@mail.com"; 
      const password = "test"; 
      const mockOperator = {
        _id: "mockOperatorId",
        email,
        password: "hashedPassword", 
      };

      Operator.findOne.mockResolvedValue(mockOperator);
      comparePassword.mockResolvedValue(true); 

      const response = await operatorService.login(email, password);

      expect(response.status).toBe(200);
      expect(response.success).toBe(true);
      expect(response.message).toBe("Login successful");
    });

    test("should return error if email or password is incorrect", async () => {
      const email = "karthi@mail.com";  
      const password = "test1";  
      
      Operator.findOne.mockResolvedValue(null);

      const response = await operatorService.login(email, password);

      expect(response.status).toBe(401);
      expect(response.success).toBe(false);
      expect(response.message).toBe("Invalid email or password");
    });

    test("should return error if fields are missing", async () => {
      const response = await operatorService.login("", ""); 
      expect(response.status).toBe(400);
      expect(response.success).toBe(false);
      expect(response.message).toBe("Email and password required");
    });
  });
});
