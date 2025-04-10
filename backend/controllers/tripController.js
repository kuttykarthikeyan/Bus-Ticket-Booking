import AdminService from "../services/adminService.js";
import BaseTripService from "../services/tripServices/baseTripService.js";
import OperatorTripService from "../services/tripServices/operatorTripService.js";
import { handleError } from "../utils/authUtils.js";
import mongoose from "mongoose";

class TripController {
  constructor() {
    this.operatorTripService = new OperatorTripService();
    this.baseTripService = new BaseTripService();
  }

  async createTrip(req, res) {
    try {
      const operator_id = req.user._id;
      console.log("Operator ID:", operator_id);

      if (!operator_id) {
        return res.status(400).json({ success: false, message: "Operator ID is missing" });
      }

      const tripData = req.body;
      tripData.operator_id = operator_id;

      const result = await this.operatorTripService.createTrip(tripData, operator_id);
      return res.status(result.status).json(result);
    } catch (error) {
      return handleError(res, error, "Error creating trip");
    }
  }

  async deleteTrip(req, res) {
    try {
      const { trip_id } = req.params;
      const operator_id = req.user._id;

      if (!mongoose.Types.ObjectId.isValid(trip_id)) {
        return res.status(400).json({ success: false, message: "Invalid Trip ID" });
      }

      const result = await this.operatorTripService.deleteTrip(trip_id, operator_id);
      return res.status(result.status).json(result);
    } catch (error) {
      return handleError(res, error, "Error deleting trip");
    }
  }

  async updateTrip(req, res) {
    try {
      const { trip_id } = req.params;
      const tripData = req.body;

      if (!mongoose.Types.ObjectId.isValid(trip_id)) {
        return res.status(400).json({ success: false, message: "Invalid Trip ID" });
      }

      const result = await this.operatorTripService.updateTrip(trip_id, tripData);
      return res.status(result.status).json(result);
    } catch (error) {
      return handleError(res, error, "Error updating trip");
    }
  }

  async cancelTrip(req, res) {
    try {
      const { trip_id } = req.params;
      const operator_id = req.user._id;

      console.log("Trip ID received:", trip_id);
      console.log("Operator ID:", operator_id);

      if (!trip_id) {
        return res.status(400).json({ success: false, message: "Trip ID is missing" });
      }

      const result = await this.operatorTripService.cancelTrip(trip_id, operator_id);
      return res.status(result.status).json(result);
    } catch (error) {
      return res.status(500).json({
        success: false,
        message: "Error cancelling trip",
        error: error.message,
      });
    }
  }

  async getAllTrips(req, res) {
    try {
      const result = await this.baseTripService.getAllTrips();
      return res.status(result.status).json(result);
    } catch (error) {
      return handleError(res, error, "Error fetching trips");
    }
  }

  async getTripById(req, res) {
    try {
      const { trip_id } = req.params;

      if (!mongoose.Types.ObjectId.isValid(trip_id)) {
        return res.status(400).json({ success: false, message: "Invalid Trip ID" });
      }

      const result = await this.baseTripService.getTripById(trip_id);
      return res.status(result.status).json(result);
    } catch (error) {
      return handleError(res, error, "Error fetching trip details");
    }
  }

  async getTripByFilter(req, res) {
    try {
      const Filter = req.body;
      const result = await this.baseTripService.getTripByFilter(Filter);
      return res.status(result.status).json(result);
    } catch (error) {
      return handleError(res, error, "Error in Filtering trips");
    }
  }
}

export default new TripController();
