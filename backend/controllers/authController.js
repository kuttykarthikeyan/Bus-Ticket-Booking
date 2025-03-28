import OperatorAuthService from "../services/authServices/operatorService.js";
import UserAuthService from "../services/authServices/userService.js";
import Operator from "../models/operatorModel.js";
import User from "../models/userModel.js";
import { handleError } from "../utils/authUtils.js";


const operatorAuthService = new OperatorAuthService(Operator);
const userAuthService = new UserAuthService(User);

const AuthController = {
  
    async operatorRegister(req, res) {
        try {
            const result = await operatorAuthService.register(req.body);
            return res.status(result.status).json(result);
        } catch (error) {
            return handleError(res, error, "Error during operator registration");
        }
    },

    async operatorLogin(req, res) {
        try {
            const { email, password } = req.body;
            const result = await operatorAuthService.login(email, password);

            if (!result.success) {
                return res.status(result.status).json(result);
            }

            return res.status(200).json({ success: true, status: 200, message: "Operator logged in successfully", data: result });
        } catch (error) {
            return handleError(res, error, "Error during operator login");
        }
    },

    async userRegister(req, res) {
        try {
            const result = await userAuthService.register(req.body);
            return res.status(result.status).json(result);
        } catch (error) {
            return handleError(res, error, "Error during user registration");
        }
    },

    async userLogin(req, res) {
        try {
            const { email, password } = req.body;
            const result = await userAuthService.login(email, password);

            if (!result.success) {
                return res.status(result.status).json(result);
            }

            return res.status(200).json({ success: true, status: 200, message: "User logged in successfully", data: result });
        } catch (error) {
            return handleError(res, error, "Error during user login");
        }
    }
};

export default AuthController;
