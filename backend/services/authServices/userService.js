import BaseAuthService from "./baseAuthService.js";
import User from "../../models/userModel.js";

class UserService extends BaseAuthService {
  constructor() {
    super(User, "user");
  }

  validateData(data) {
    return !data.name || !data.email || !data.phone || !data.password
      ? "All fields are required"
      : null;
  }

  createInstance(data) {
    return new User({ 
      name: data.name, 
      email: data.email, 
      phone: data.phone, 
      password: data.password 
    });
  }
}

export default UserService;
