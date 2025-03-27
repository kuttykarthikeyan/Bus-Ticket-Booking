import Trip from "../../models/tripModel.js";
import User from "../../models/userModel.js";
import BaseTripService from "./baseTripService.js";

class UserTripService {
    constructor() {
        this.baseTripService = new BaseTripService();
    }

    async getTripById(tripId) {
        return this.baseTripService.getTripById(tripId);
    }

    async getAllTrips() {
        return this.baseTripService.getAllTrips();
    }

    async getUserTrips(userId) {
        try {
            const user = await User.findById(userId).lean();
            return {
                status: 200,
                success: true,
                message: "User trips retrieved successfully",
                booked_trips: user.booked_trips || [],
                cancelled_trips: user.cancelled_trips || []
            };
        } catch (error) {
            return { status: 500, success: false, message: "Error fetching user trips", error: error.message };
        }
    }

    async getUserProfile(userId) {
        try {
            const user = await User.findById(userId).lean();
            return { status: 200, success: true, message: "User profile retrieved", user };
        } catch (error) {
            return { status: 500, success: false, message: "Error fetching user profile", error: error.message };
        }
    }

    async getTripByFilter(filter) {
        try {
            const trips = await Trip.find(filter)
            return { status: 200, success: true, message: "Filtered trips retrieved", trips };
        } catch (error) {
            return { status: 500, success: false, message: "Error fetching trips", error: error.message };
        }
    }

    async updateProfile(userId, update) {
        try {
            const user = await User.findByIdAndUpdate(userId, update, { new: true }).lean();
            return { status: 200, success: true, message: "Profile updated successfully", user };
        } catch (error) {
            return { status: 500, success: false, message: "Error updating profile", error: error.message };
        }
    }
}

export default UserTripService;
