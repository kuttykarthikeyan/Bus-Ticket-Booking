import OperatorAuthService from "../services/authServices/operatorService.js";
import UserAuthService from "../services/authServices/userService.js";
import Operator from "../models/operatorModel.js";
import User from "../models/userModel.js";
import { handleError } from "../utils/authUtils.js";

const operatorAuthService = new OperatorAuthService(Operator);
const userAuthService = new UserAuthService(User)
class AuthController {
    
    static async handleRegistration(service, req, res, userType) {
        try {
            const result = await service.register(req.body);
            
            return res.status(result.status).json(result);
        } catch (error) {
            return handleError(res, error, `Error during ${userType} registration`);
        }
    }

    static async handleLogin(service, req, res, userType) {
        try {
            const { email, password } = req.body;
            const result = await service.login(email, password);

            if (!result.success) {
                return res.status(result.status).json(result);
            }

            return res.status(200).json({
                success: true,
                status: 200,
                message: `${userType} logged in successfully`,
                data: result
            });
        } catch (error) {
            return handleError(res, error, `Error during ${userType} login`);
        }
    }

    static async operatorRegister(req, res) {
        return AuthController.handleRegistration(operatorAuthService, req, res, "operator");
    }

    static async operatorLogin(req, res) {
        return AuthController.handleLogin(operatorAuthService, req, res, "operator");
    }

    static async userRegister(req, res) {
        return AuthController.handleRegistration(userAuthService, req, res, "user");
    }

    static async userLogin(req, res) {
        return AuthController.handleLogin(userAuthService, req, res, "user");
    }
}

export default AuthController;
