import Trip from "../../models/tripModel.js";

class BaseTripService {
 
  async getTripById(tripId) {
    const trip = await Trip.findById(tripId);
    if (!trip) return { status: 404, success: false, message: "Trip not found" };
    return { status: 200, success: true, message:"Trip retrived ",data: trip };
  }

  async getAllTrips() {
    const trips = await Trip.find();
    return { status: 200, success: true, message:"trips retrived ",data :trips };
  }


  
}

export default BaseTripService;
