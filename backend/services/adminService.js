import OperatorTripService from "../services/tripServices/operatorTripService.js";
import User from "../models/userModel.js";
import Operator from "../models/operatorModel.js";

class AdminService {
    constructor() {
        this.operatorTripService = new OperatorTripService();
    }

    async handleDatabaseOperation(operation, successMessage) {
        try {
            const result = await operation();
            if (!result) return { status: 404, success: false, message: "Not found" };
            return { status: 200, success: true, message: successMessage, data: result };
        } catch (error) {
            console.error(`${successMessage} failed:`, error);
            return { status: 500, success: false, message: `Error: ${successMessage.toLowerCase()}`, error: error.message };
        }
    }

    createTrip(tripData, operatorId) {
        return this.operatorTripService.createTrip(tripData, operatorId);
    }

    updateTrip(tripId, tripData) {
        return this.operatorTripService.updateTrip(tripId, tripData);
    }

    deleteTrip(tripId) {
        return this.operatorTripService.deleteTrip(tripId);
    }

    getAllTrips() {
        return this.operatorTripService.getAllTrips();
    }

    getTripById(tripId) {
        return this.operatorTripService.getTripById(tripId);
    }

    cancelTrip(tripId) {
        return this.operatorTripService.cancelTrip(tripId);
    }

    getOperatorTrips(operatorId) {
        return this.operatorTripService.getOperatorTrips(operatorId);
    }

    // 🔹 User Management
    getAllUsers() {
        return this.handleDatabaseOperation(() => User.find(), "Users retrieved successfully");
    }

    async toggleUserBlock(userId, blockStatus) {
        return this.handleDatabaseOperation(
            () => User.findByIdAndUpdate(userId, { isBlocked: blockStatus }, { new: true }).select("-password"),
            blockStatus ? "User blocked successfully" : "User unblocked successfully"
        );
    }

    blockUser(userId) {
        return this.toggleUserBlock(userId, true);
    }

    unblockUser(userId) {
        return this.toggleUserBlock(userId, false);
    }

    getAllOperators() {
        return this.handleDatabaseOperation(() => Operator.find(), "Operators retrieved successfully");
    }

    async toggleOperatorBlock(operatorId, blockStatus) {
        return this.handleDatabaseOperation(
            () => Operator.findByIdAndUpdate(operatorId, { isBlocked: blockStatus }, { new: true }).select("-password"),
            blockStatus ? "Operator blocked successfully" : "Operator unblocked successfully"
        );
    }

    blockOperator(operatorId) {
        return this.toggleOperatorBlock(operatorId, true);
    }

    unblockOperator(operatorId) {
        return this.toggleOperatorBlock(operatorId, false);
    }
}

export default AdminService;
