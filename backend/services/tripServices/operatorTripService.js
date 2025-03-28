import BaseTripService from "./baseTripService.js";
import Trip from "../../models/tripModel.js";



class OperatorTripService  {
 constructor() {
        this.baseTripService = new BaseTripService();
    }
    async getTripById(tripId) {
        return this.baseTripService.getTripById(tripId);
    }
    async getAllTrips() {
        return this.baseTripService.getAllTrips();
    }
    
    async createTrip(tripData, operatorId) {
        if (!operatorId) {
            return { status: 400, success: false, message: "Operator ID is required" };
        }
    
        try {
            const { total_seats, source, destination, departure_time, arrival_time, price, bus_id } = tripData;
    
            if (!total_seats || total_seats <= 0) {
                return { status: 400, success: false, message: "Total seats must be greater than 0" };
            }
    
            if (!source || !destination || !departure_time || !arrival_time || !price || !bus_id) {
                return { status: 400, success: false, message: "All fields are required" };
            }
    
            const seats = Array.from({ length: total_seats }, (_, i) => `S${i + 1}`);
    
            const newTrip = new Trip({
                operatorId,
                bus_id,
                source: source.trim(),
                destination: destination.trim(),
                departure_time,
                arrival_time,
                price,
                total_seats,
                available_seats: seats
              
            });
    
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
    async cancelTrip(tripId) {
        try {
            const cancelledTrip = await Trip.findByIdAndUpdate(tripId, { isCancelled: true }, { new: true });
            if (!cancelledTrip) return { status: 404, success: false, message: "Trip not found" };
            return { status: 200, success: true, message: "Trip cancelled successfully", trip: cancelledTrip };
        } catch (error) {
            return { status: 500, success: false, message: "Error cancelling trip", error: error.message };
        }
    }
    async getOperatorTrips(operatorId) {
        try{
            const trips = await Trip.find({operatorId});
            if(!trips){
                return {status:400,success:false,message:"Trips not found"};
            }
            return {status:200,success:true,message:"Trips retrieved successfully",trips};
        }
         catch(error)
         {
            return{status: 500,success:false,message:"Error in getting Operator Trips ",error:error.message}
         }
         
        }

    
}

export default OperatorTripService;
