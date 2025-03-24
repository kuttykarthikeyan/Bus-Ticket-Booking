import UserAuthService from "../services/authServices/userService.js";
import User from "../models/userModel.js";

const userAuthService = new UserAuthService(User);

const userController = {
  async register(req, res) {
    try {
      const result = await userAuthService.register(req.body);
      return res.status(result.status).json(result);
    } catch (error) {
      return res.status(500).json({ success: false, message: "Server error" });
    }
  },

  async login(req, res) {
    try {
      const { email, password } = req.body;
      const result = await userAuthService.login(email, password);
      return res.status(result.status).json(result);
    } catch (error) {
      return res.status(500).json({ success: false, message: "Server error" });
    }
  }
};

export default userController;
