import OperatorTripService from "../services/tripServices/operatorTripService.js";
import User from "../models/userModel.js";
import Operator from "../models/operatorModel.js";

class AdminService {
    constructor() {
        this.operatorTripService = new OperatorTripService();
    }

    async createTrip(tripData, operatorId) {
        return await this.operatorTripService.createTrip(tripData, operatorId);
    }

    async updateTrip(tripId, tripData) {
        return await this.operatorTripService.updateTrip(tripId, tripData);
    }

    async deleteTrip(tripId) {
        return await this.operatorTripService.deleteTrip(tripId);
    }
  
    async getAllTrips() {
        return await this.operatorTripService.getAllTrips();
    }
    async getTripById(tripId) {
        return await this.operatorTripService.getTripById(tripId);
    }
    async cancelTrip(tripId) {
        return await this.operatorTripService.cancelTrip(tripId);
    }
    async getOperatorTrips(operatorId) {
        
        return await this.operatorTripService.getOperatorTrips(operatorId);
    
}
    async getAllUsers() {
        try {
            const users = await User.find();
            return { status: 200, success: true, message: "Users retrieved successfully", users };
        } catch (error) {
            return { status: 500, success: false, message: "Error retrieving users", error: error.message };
        }
    }

    async getAllOperators() {
        try {
            const operators = await Operator.find();
            return { status: 200, success: true, message: "Operators retrieved successfully", operators };
        } catch (error) {
            return { status: 500, success: false, message: "Error retrieving operators", error: error.message };
        }
    }

    async blockUser(userId) {
        try {
            const user = await User.findByIdAndUpdate(userId, { isBlocked: true }, { new: true });
            if (!user) return { status: 404, success: false, message: "User not found" };
            return { status: 200, success: true, message: "User blocked successfully", user };
        } catch (error) {
            return { status: 500, success: false, message: "Error blocking user", error: error.message };
        }
    }

    async unblockUser(userId) {
        try {
            const user = await User.findByIdAndUpdate(userId, { isBlocked: false }, { new: true });
            if (!user) return { status: 404, success: false, message: "User not found" };
            return { status: 200, success: true, message: "User unblocked successfully", user };
        } catch (error) {
            return { status: 500, success: false, message: "Error unblocking user", error: error.message };
        }
    }

    async blockOperator(operatorId) {
        try {
            const operator = await Operator.findByIdAndUpdate(operatorId, { isBlocked: true }, { new: true });
            if (!operator) return { status: 404, success: false, message: "Operator not found" };
            return { status: 200, success: true, message: "Operator blocked successfully", operator };
        } catch (error) {
            return { status: 500, success: false, message: "Error blocking operator", error: error.message };
        }
    }

    async unblockOperator(operatorId) {
        try {
            const operator = await Operator.findByIdAndUpdate(operatorId, { isBlocked: false }, { new: true });
            if (!operator) return { status: 404, success: false, message: "Operator not found" };
            return { status: 200, success: true, message: "Operator unblocked successfully", operator };
        } catch (error) {
            return { status: 500, success: false, message: "Error unblocking operator", error: error.message };
        }
    }
}

export default AdminService;
