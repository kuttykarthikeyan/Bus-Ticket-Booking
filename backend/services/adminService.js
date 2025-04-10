import OperatorTripService from "../services/tripServices/operatorTripService.js";
import User from "../models/userModel.js";
import Operator from "../models/operatorModel.js";
import Trip from "../models/tripModel.js";

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

    createTrip(tripData, operator_id) {
        return this.operatorTripService.createTrip(tripData, operator_id);
    }

    updateTrip(trip_id, tripData) {
        return this.operatorTripService.updateTrip(trip_id, tripData);
    }

    deleteTrip(trip_id) {
        return this.operatorTripService.deleteTrip(trip_id);
    }

    getAllTrips() {
        return this.operatorTripService.getAllTrips();
    }

    getTripById(trip_id) {
        return this.operatorTripService.getTripById(trip_id);
    }

    cancelTrip(trip_id) {
        return this.operatorTripService.cancelTrip(trip_id);
    }

    getOperatorTrips(operator_id) {
        return this.operatorTripService.getOperatorTrips(operator_id);
    }

    // 🔹 User Management
    getAllUsers() {
        return this.handleDatabaseOperation(() => User.find(), "Users retrieved successfully");
    }

    async toggleUserBlock(user_id, blockStatus) {
        return this.handleDatabaseOperation(
            () => User.findByIdAndUpdate(user_id, { isBlocked: blockStatus }, { new: true }).select("-password"),
            blockStatus ? "User blocked successfully" : "User unblocked successfully"
        );
    }

    blockUser(user_id) {
        return this.toggleUserBlock(user_id, true);
    }

    unblockUser(user_id) {
        return this.toggleUserBlock(user_id, false);
    }

    getAllOperators() {
        return this.handleDatabaseOperation(() => Operator.find(), "Operators retrieved successfully");
    }

    async toggleOperatorBlock(operator_id, blockStatus) {
        return this.handleDatabaseOperation(
            () => Operator.findByIdAndUpdate(operator_id, { isBlocked: blockStatus }, { new: true }).select("-password"),
            blockStatus ? "Operator blocked successfully" : "Operator unblocked successfully"
        );
    }

    blockOperator(operator_id) {
        return this.toggleOperatorBlock(operator_id, true);
    }

    unblockOperator(operator_id) {
        return this.toggleOperatorBlock(operator_id, false);
    }

    getTripsByFilter(Filter)
    {
        return this.operatorTripService.getTripByFilter(Filter);
    }
    async getAnalytics() {
        try {
          // Operators
          const totalOperators = await Operator.countDocuments();
          const activeOperators = await Operator.countDocuments({
            status: "active",
            isBlocked: false
          });
      
          // Trips
          const totalTrips = await Trip.countDocuments();
          const activeTrips = await Trip.countDocuments({ isCancelled: false });
      
          // Users
          const totalUsers = await User.countDocuments();
          const blockedUsers = await User.countDocuments({ isBlocked: true });
          const unblockedUsers = await User.countDocuments({ isBlocked: false });
      
          // Trips per operator (only counts)
          const tripsPerOperator = await Trip.aggregate([
            {
              $group: {
                _id: "$operator_id",
                tripCount: { $sum: 1 }
              }
            }
          ]);
      
          return {
            status: 200,
            message: "Analytics fetched successfully",
            data: {
              operators: {
                total: totalOperators,
                active: activeOperators,
                tripsPerOperator: tripsPerOperator // Just operator ID and count
              },
              trips: {
                total: totalTrips,
                active: activeTrips
              },
              users: {
                total: totalUsers,
                blocked: blockedUsers,
                unblocked: unblockedUsers
              }
            }
          };
        } catch (error) {
          console.error("Analytics Service Error:", error);
          return {
            status: 500,
            message: "Failed to fetch analytics",
            error: error.message
          };
        }
      }
      
}

export default AdminService;
