import OperatorAuthService from "../../services/authServices/operatorService.js";
import Operator from "../../models/operatorModel.js";

const operatorAuthService = new OperatorAuthService(Operator);

const operatorAuthController = {
  async register(req, res) {
    try {
      const result = await operatorAuthService.register(req.body);
      return res.status(result.status).json(result);
    } catch (error) {
      return res.status(500).json({ success: false, message: "Server error", error: error.message });
    }
  },

  async login(req, res) {
    try {
      const { email, password } = req.body;
      const result = await operatorAuthService.login(email, password);
      return res.status(result.status).json(result);
    } catch (error) {
      return res.status(500).json({ success: false, message: "Server error", error: error.message });
    }
  }
};

export default operatorAuthController;
