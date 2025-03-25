import OperatorTripService from "../../services/tripServices/operatorTripService.js";

const operatorTripService = new OperatorTripService();

const operatorTripController = {
  async createTrip(req, res) {
    try {
      const operatorId = req.user.operatorId;
      const tripData = req.body;
      const result = await operatorTripService.createTrip(tripData, operatorId);
      return res.status(result.status).json(result);
    } catch (error) {
      return res.status(500).json({ success: false, message: "Error creating trip", error: error.message });
    }
  },

  async updateTrip(req, res) {
    try {
      const result = await operatorTripService.updateTrip(req.params.tripId, req.body);
      return res.status(result.status).json(result);
    } catch (error) {
      return res.status(500).json({ success: false, message: "Error updating trip", error: error.message });
    }
  },

  async deleteTrip(req, res) {
    try {
      const result = await operatorTripService.deleteTrip(req.params.tripId);
      return res.status(result.status).json(result);
    } catch (error) {
      return res.status(500).json({ success: false, message: "Error deleting trip", error: error.message });
    }
  },

  async getTrips(req, res) {
    try {
      const result = await operatorTripService.getAllTrips();
      return res.status(result.status).json(result);
    } catch (error) {
      return res.status(500).json({ success: false, message: "Error getting trips", error: error.message });
    }
  }
};

export default operatorTripController;
