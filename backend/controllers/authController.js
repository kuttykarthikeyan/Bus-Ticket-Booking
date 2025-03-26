import OperatorAuthService from "../services/authServices/operatorService.js";
import UserAuthService from "../services/authServices/userService.js";
import Operator from "../models/operatorModel.js";
import User from "../models/userModel.js";

const operatorAuthService = new OperatorAuthService(Operator);
const userAuthService = new UserAuthService(User);

const authController = {
  // Operator Registration
  async operatorRegister(req, res) {
    try {
      const result = await operatorAuthService.register(req.body);
      return res.status(result.status).json(result);
    } catch (error) {
      console.error("Error during operator registration:", error);
      return res.status(500).json({ success: false, message: "Server error", error: error.message });
    }
  },

  // Operator Login
  async operatorLogin(req, res) {
    try {
      const { email, password } = req.body;
      const result = await operatorAuthService.login(email, password);
      
      if (!result.success) {
        return res.status(401).json(result); // Unauthorized
      }

      return res.status(result.status).json(result);
    } catch (error) {
      console.error("Error during operator login:", error);
      return res.status(500).json({ success: false, message: "Server error", error: error.message });
    }
  },

  // User Registration
  async userRegister(req, res) {
    try {
      const result = await userAuthService.register(req.body);
      return res.status(result.status).json(result);
    } catch (error) {
      console.error("Error during user registration:", error);
      return res.status(500).json({ success: false, message: "Server error", error: error.message });
    }
  },

  // User Login
  async userLogin(req, res) {
    try {
      const { email, password } = req.body;
      const result = await userAuthService.login(email, password);
      
      if (!result.success) {
        return res.status(401).json(result); // Unauthorized
      }

      return res.status(result.status).json(result);
    } catch (error) {
      console.error("Error during user login:", error);
      return res.status(500).json({ success: false, message: "Server error", error: error.message });
    }
  }
};

export default authController;
