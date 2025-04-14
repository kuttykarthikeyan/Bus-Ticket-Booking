import User from "../models/userModel.js";
import Operator from "../models/operatorModel.js";
import Bus from "../models/busModel.js"; 
import Booking from "../models/bookingModel.js";

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

    async getUserHistory(user_id) {
        return this.handleDatabaseOperation(
            async () => {
                const bookings = await Booking.find({ user_id: user_id }).populate('trip_id'); // Populate trip details

                const bookedTrips = bookings.filter(booking => booking.booking_status === "confirmed");
                const canceledTrips = bookings.filter(booking => booking.booking_status === "cancelled");

                return {
                    bookedTrips,
                    canceledTrips
                };
            },
            "User trip history retrieved successfully",
            "Error retrieving user trip history"
        );
    }

    async getOperatorHistory(operator_id) {
        return this.handleDatabaseOperation(
            async () => {
                const buses = await Bus.find({ operator_id: operator_id }); 
                return {
                    createdBuses: buses
                };
            },
            "Operator bus history retrieved successfully",
            "Error retrieving operator bus history"
        );
    }
}

export default ProfileService;
