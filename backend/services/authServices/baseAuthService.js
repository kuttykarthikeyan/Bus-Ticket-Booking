import { hashPassword, comparePassword, generateToken } from "../../utils/authUtils.js";

class BaseAuthService {
  constructor(model, role) {
    this.model = model;
    this.role = role;
  }

  async register(data) {
    const error = this.validateData(data);
    if (error) return { status: 400, success: false, message: error };

    const existingUser = await this.model.findOne({ email: data.email });
    if (existingUser) {
      return { status: 400, success: false, message: `${this.role} already exists` };
    }

    data.password = await hashPassword(data.password);
    await this.model.create(data);

    return { status: 201, success: true, message: `${this.role} registered successfully` };
  }

  async login(email, password) {
    if (!email || !password) {
      return { status: 400, success: false, message: "Email and password required" };
    }

    const entity = await this.model.findOne({ email });
    if (!entity || !(await comparePassword(password, entity.password))) {
      return { status: 401, success: false, message: "Invalid email or password" };
    }

    return {
      status: 200,
      success: true,
      message: "Login successful",
      token: generateToken(entity._id, this.role),
    };
  }

  validateData(data) {
    if (!data.email || !data.password) return "Email and password are required";
    return null;
  }
}

export default BaseAuthService;
