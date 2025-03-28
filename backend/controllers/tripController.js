import AdminService from "../services/adminService.js";
import OperatorTripService from "../services/tripServices/operatorTripService.js";
import { handleError } from "../utils/authUtils.js";

const adminService = new AdminService();
const operatorTripService = new OperatorTripService();

const TripController = {
    async createTrip(req, res) {
        try {
            const operatorId = req.user._id;
            const tripData = req.body;
            const result = await operatorTripService.createTrip(tripData, operatorId);
            return res.status(result.status).json(result);
        } catch (error) {
            return handleError(res, error, "Error creating trip");
        }
    },

    async deleteTrip(req, res) {
        try {
            const { tripId } = req.params;
            const result = await adminService.deleteTrip(tripId);
            return res.status(result.status).json(result);
        } catch (error) {
            return handleError(res, error, "Error deleting trip");
        }
    },

    async updateTrip(req, res) {
        try {
            const operatorId = req.user._id;
            const { tripId } = req.params;
            const tripData = req.body;
            const result = await operatorTripService.updateTrip(tripId, operatorId, tripData);
            return res.status(result.status).json(result);
        } catch (error) {
            return handleError(res, error, "Error updating trip");
        }
    },

    async cancelTrip(req, res) {
        try {
            const { tripId } = req.params;
            const result = await adminService.cancelTrip(tripId);
            return res.status(result.status).json(result);
        } catch (error) {
            return handleError(res, error, "Error cancelling trip");
        }
    },

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
            const { tripId } = req.params;
            const result = await adminService.getTripById(tripId);
            return res.status(result.status).json(result);
        } catch (error) {
            return handleError(res, error, "Error fetching trip details");
        }
    }
};

export default TripController;
