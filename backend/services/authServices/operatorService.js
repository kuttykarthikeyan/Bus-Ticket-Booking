import BaseAuthService from "./baseAuthService.js";
import Operator from "../../models/operatorModel.js";

class OperatorService extends BaseAuthService {
  constructor() {
    super(Operator, "operator");
  }

  validateData(data) {
    return !data.company_name || !data.email || !data.phone || !data.password
      ? "All fields are required"
      : null;
  }

  createInstance(data) {
    return new Operator({ 
      company_name: data.company_name, 
      email: data.email, 
      phone: data.phone, 
      password: data.password, 
      verification_status: "pending" 
    });
  }
}

export default OperatorService;