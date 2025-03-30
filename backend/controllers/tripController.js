import AdminService from "../services/adminService.js";
import OperatorTripService from "../services/tripServices/operatorTripService.js";
import { handleError } from "../utils/authUtils.js";
import mongoose from "mongoose";

const adminService = new AdminService();
const operatorTripService = new OperatorTripService();

const TripController = {
    async createTrip(req, res) {
        try {
            const operator_id = req.user._id;  // Get operator_id from the authenticated user
            console.log("Operator ID:", operator_id); // Debugging

            if (!operator_id) {
                return res.status(400).json({ success: false, message: "Operator ID is missing" });
            }

            const tripData = req.body;
            tripData.operator_id = operator_id;  // Ensure operator_id is added

            const result = await operatorTripService.createTrip(tripData, operator_id); // Pass correct ID

            return res.status(result.status).json(result);
        } catch (error) {
            return handleError(res, error, "Error creating trip");
        }
    },
    async deleteTrip(req, res) {
        try {
            const { trip_id } = req.params;
            const operator_id = req.user._id;

            if (!mongoose.Types.ObjectId.isValid(trip_id)) return res.status(400).json({ success: false, message: "Invalid Trip ID" });

            const result = await operatorTripService.deleteTrip(trip_id, operator_id);
            return res.status(result.status).json(result);
        } catch (error) {
            return handleError(res, error, "Error deleting trip");
        }
    },

    async updateTrip(req, res) {
        try {
            const { trip_id } = req.params;
            const tripData = req.body;

            if (!mongoose.Types.ObjectId.isValid(trip_id)) return res.status(400).json({ success: false, message: "Invalid Trip ID" });

            const result = await operatorTripService.updateTrip(trip_id, tripData);
            return res.status(result.status).json(result);
        } catch (error) {
            return handleError(res, error, "Error updating trip");
        }
    },

    async cancelTrip(req, res) {
        try {
            const { trip_id } = req.params; // Ensure correct parameter name
            const operator_id = req.user._id; // Extract operator_id from authenticated user
    
            console.log("Trip ID received:", trip_id);
            console.log("Operator ID:", operator_id);
    
            if (!trip_id) {
                return res.status(400).json({ success: false, message: "Trip ID is missing" });
            }
    
            const result = await operatorTripService.cancelTrip(trip_id, operator_id);
            return res.status(result.status).json(result);
        } catch (error) {
            return res.status(500).json({
                success: false,
                message: "Error cancelling trip",
                error: error.message,
            });
        }
    }
    
    ,
    
    async getAllTrips(req, res) {
        try {
            const result = await adminService.getAllTrips();
            return res.status(result.status).json(result);
        } catch (error) {
            return handleError(res, error, "Error fetching trips");
        }
    },

    async getTripById(req, res) {
        try {
            const { trip_id } = req.params;

            if (!mongoose.Types.ObjectId.isValid(trip_id)) return res.status(400).json({ success: false, message: "Invalid Trip ID" });

            const result = await adminService.getTripById(trip_id);
            return res.status(result.status).json(result);
        } catch (error) {
            return handleError(res, error, "Error fetching trip details");
        }
    }
};

export default TripController;
