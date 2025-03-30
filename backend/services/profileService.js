import User from "../models/userModel.js";
import Operator from "../models/operatorModel.js";

class ProfileService {
   
    async handleDatabaseOperation(operation, successMessage, errorMessage) {
        try {
            const result = await operation();
            if (!result) return { status: 404, success: false, message: "Not found" };
            return { status: 200, success: true, message: successMessage, data: result };
        } catch (error) {
            console.error(`${errorMessage} failed:`, error);
            return { status: 500, success: false, message: errorMessage, error: error.message };
        }
    }

    async getUserProfile(user_id) {
        return this.handleDatabaseOperation(
            () => User.findById(user_id),
            "User profile retrieved successfully",
            "Error retrieving user profile"
        );
    }

    async getOperatorProfile(operator_id) {
        return this.handleDatabaseOperation(
            () => Operator.findById(operator_id),
            "Operator profile retrieved successfully",
            "Error retrieving operator profile"
        );
    }

    async updateOperatorProfile(operator_id, operatorData) {
        return this.handleDatabaseOperation(
            () => Operator.findByIdAndUpdate(operator_id, { $set: operatorData }, { new: true, runValidators: true }),
            "Operator profile updated successfully",
            "Error updating operator profile"
        );
    }

    async updateUserProfile(user_id, userData) {
        return this.handleDatabaseOperation(
            () => User.findByIdAndUpdate(user_id, { $set: userData }, { new: true, runValidators: true }),
            "User profile updated successfully",
            "Error updating user profile"
        );
    }
}

export default ProfileService;
