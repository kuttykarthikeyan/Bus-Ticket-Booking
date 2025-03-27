import AdminService from "../services/adminService.js";
import OperatorTripService from "../services/tripServices/operatorTripService.js";
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
      return res.status(500).json({ success: false, message: "Error creating trip", error: error.message });
    }
  },

    async updateTrip(req, res) {
        try {
            const { tripId } = req.params;
            const tripData = req.body;
            const response = await adminService.updateTrip(tripId, tripData);
            return res.status(response.status).json(response);
        } catch (error) {
            return res.status(500).json({ success: false, message: "Error updating trip", error: error.message });
        }
    },

    async deleteTrip(req, res) {
        try {
            const { tripId } = req.params;
            const response = await adminService.deleteTrip(tripId);
            return res.status(response.status).json(response);
        } catch (error) {
            return res.status(500).json({ success: false, message: "Error deleting trip", error: error.message });
        }
    },

    async getAllTrips(req, res) {
        try {
            const response = await adminService.getAllTrips();
            return res.status(response.status).json(response);
        } catch (error) {
            return res.status(500).json({ success: false, message: "Error retrieving trips", error: error.message });
        }
    },

    async getTripById(req, res) {
        try {
            const { tripId } = req.params;
            const response = await adminService.getTripById(tripId);
            return res.status(response.status).json(response);
        } catch (error) {
            return res.status(500).json({ success: false, message: "Error retrieving trip", error: error.message });
        }
    },
    async cancelTrip(req, res) {
        try {
            const { tripId } = req.params;
            const response = await adminService.cancelTrip(tripId);
            return res.status(response.status).json(response);
        } catch (error) {
            return res.status(500).json({ success: false, message: "Error cancelling trip", error: error.message });
        }
    }
    

};

export default TripController;
