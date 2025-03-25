import BaseTripService from "./baseTripService.js";
import Trip from "../../models/tripModel.js";
import Bus from "../../models/busModel.js";

class OperatorTripService extends BaseTripService {
    
    async createTrip(tripData, operatorId) {
        if (!operatorId) return { status: 400, success: false, message: "Operator ID is required" };
        
        try {
            const newTrip = new Trip({ ...tripData, operatorId });
            await newTrip.save();
            return { status: 201, success: true, message: "Trip created successfully", trip: newTrip };
        } catch (error) {
            return { status: 500, success: false, message: "Error creating trip", error: error.message };
        }
    }

    async updateTrip(tripId, tripData) {
        try {
            const updatedTrip = await Trip.findByIdAndUpdate(tripId, tripData, { new: true });
            if (!updatedTrip) return { status: 404, success: false, message: "Trip not found" };
            return { status: 200, success: true, message: "Trip updated successfully", trip: updatedTrip };
        } catch (error) {
            return { status: 500, success: false, message: "Error updating trip", error: error.message };
        }
    }

    async deleteTrip(tripId) {
        try {
            const deletedTrip = await Trip.findByIdAndDelete(tripId);
            if (!deletedTrip) return { status: 404, success: false, message: "Trip not found" };
            return { status: 200, success: true, message: "Trip deleted successfully" };
        } catch (error) {
            return { status: 500, success: false, message: "Error deleting trip", error: error.message };
        }
    }

    
}

export default OperatorTripService;
