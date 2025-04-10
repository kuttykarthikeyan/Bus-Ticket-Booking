import BaseTripService from "./baseTripService.js";
import Trip from "../../models/tripModel.js";
import Operator from "../../models/operatorModel.js";
import mongoose from "mongoose";

class OperatorTripService {
    constructor() {
        this.baseTripService = new BaseTripService();
    }

    async getTripById(trip_id) {
        return this.baseTripService.getTripById(trip_id);
    }

    async getAllTrips() {
        return this.baseTripService.getAllTrips();
    }
    async getTripByFilter(Filter){
        return this.baseTripService.getTripByFilter(Filter);
    }

    async createTrip(tripData, operator_id) {
        if (!operator_id) {
            return { status: 400, success: false, message: "Operator ID is required" };
        }

        try {
            const { total_seats, source, destination, departure_time, arrival_time, price, bus_id } = tripData;
            if (!total_seats || total_seats <= 0) {
                return { status: 400, success: false, message: "Total seats must be greater than 0" };
            }

            const available_seats = Array.from({ length: total_seats }, (_, i) => i + 1);

            const newTrip = new Trip({
                operator_id,
                bus_id,
                source,
                destination,
                departure_time,
                arrival_time,
                price,
                total_seats,
                available_seats,
            });

            await newTrip.save();
            await Operator.findByIdAndUpdate(operator_id, { $push: { trips: newTrip._id } });

            return { status: 201, success: true, message: "Trip created successfully", trip: newTrip };
        } catch (error) {
            return { status: 500, success: false, message: "Error creating trip", error: error.message };
        }
    }

    /**  FIXED cancelTrip Method **/
    async cancelTrip(trip_id, operator_id) {
        if (!operator_id) {
            return { status: 400, success: false, message: "Operator ID is required" };
        }
    
        if (!mongoose.Types.ObjectId.isValid(trip_id)) {
            return { status: 400, success: false, message: "Invalid trip ID format" };
        }
    
        try {
            const trip = await Trip.findOne({ _id: trip_id, operator_id }); 
            if (!trip) {
                return { status: 404, success: false, message: "Trip not found or unauthorized" };
            }
    
            trip.isCancelled = true;
            await trip.save();
    
            return { status: 200, success: true, message: "Trip cancelled successfully" ,data: trip};
        } catch (error) {
            return { status: 500, success: false, message: "Error cancelling trip", error: error.message };
        }
    }

      async updateTrip(trip_id, tripData) {
        try {
          if (!mongoose.Types.ObjectId.isValid(trip_id)) {
            return { status: 400, success: false, message: "Invalid trip ID format" };
          }
    
          const trip = await Trip.findById(trip_id);
          if (!trip) {
            return { status: 404, success: false, message: "Trip not found" };
          }
    
          const updatableFields = [
            "source",
            "destination",
            "departure_time",
            "arrival_time",
            "price",
            "isCancelled"
          ];
    
          const updatePayload = {};
          for (const key of updatableFields) {
            if (key in tripData) {
              updatePayload[key] = tripData[key];
            }
          }
    
          const updatedTrip = await Trip.findByIdAndUpdate(trip_id, updatePayload, { new: true });
    
          return {
            status: 200,
            success: true,
            message: "Trip updated successfully",
            trip: updatedTrip
          };
        } catch (error) {
          return {
            status: 500,
            success: false,
            message: "Error updating trip",
            error: error.message
          };
        }
      }

    

    async deleteTrip(trip_id, operator_id) {
        try {
            if (!mongoose.Types.ObjectId.isValid(trip_id) || !mongoose.Types.ObjectId.isValid(operator_id)) {
                return { status: 400, success: false, message: "Invalid trip ID or operator ID format" };
            }

            const trip = await Trip.findOne({ _id: trip_id, operator_id });
            if (!trip) {
                return { status: 404, success: false, message: "Trip not found or does not belong to this operator" };
            }

            await Trip.findByIdAndDelete(trip_id);
            await Operator.findByIdAndUpdate(operator_id, { $pull: { trips: trip_id } });

            return { status: 200, success: true, message: "Trip deleted successfully" };
        } catch (error) {
            return { status: 500, success: false, message: "Error deleting trip", error: error.message };
        }
    }

    async getOperatorTrips(operator_id) {
        try {
            if (!mongoose.Types.ObjectId.isValid(operator_id)) {
                return { status: 400, success: false, message: "Invalid operator ID format" };
            }

            const trips = await Trip.find({ operator_id });
            if (!trips.length) {
                return { status: 404, success: false, message: "No trips found for this operator" };
            }
            return { status: 200, success: true, message: "Trips retrieved successfully", data: trips };
        } catch (error) {
            return { status: 500, success: false, message: "Error retrieving operator trips", error: error.message };
        }
    }
}

export default OperatorTripService;
