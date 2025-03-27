import Trip from "../../models/tripModel.js";

class BaseTripService {
 
  async getTripById(tripId) {
    const trip = await Trip.findById(tripId);
    if (!trip) return { status: 404, success: false, message: "Trip not found" };
    return { status: 200, success: true, trip };
  }

  async getAllTrips() {
    const trips = await Trip.find();
    return { status: 200, success: true, trips };
  }


  
}

export default BaseTripService;
