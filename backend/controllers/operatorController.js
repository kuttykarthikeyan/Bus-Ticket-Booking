import OperatorAuthService from "../services/authServices/operatorService.js";
import Operator from "../models/operatorModel.js";

const operatorAuthService = new OperatorAuthService(Operator);

const operatorController = {
  async register(req, res) {
    try {
      const result = await operatorAuthService.register(req.body);
      return res.status(result.status).json(result);
    } catch (error) {
      return res.status(500).json({ success: false, message: "Server error" });
    }
  },

  async login(req, res) {
    try {
      const { email, password } = req.body;
      const result = await operatorAuthService.login(email, password);
      return res.status(result.status).json(result);
    } catch (error) {
      return res.status(500).json({ success: false, message: "Server error" });
    }
  }
};

export default operatorController;
