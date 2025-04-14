import Trip from "../../models/tripModel.js";

class BaseTripService {
 
async getTripById(trip_id) {
  try {
    const trip = await Trip.findById(trip_id).populate("bus_id"); 
    if (!trip) return { status: 404, success: false, message: "Trip not found" };
    return { status: 200, success: true, message: "Trip retrieved", data: trip };
  } catch (error) {
    return { status: 500, success: false, message: "Error fetching trip", error: error.message };
  }
}

async getAllTrips() {
  try {
    const trips = await Trip.find().populate("bus_id"); 
    return { status: 200, success: true, message: "Trips retrieved", data: trips };
  } catch (error) {
    return { status: 500, success: false, message: "Error fetching trips", error: error.message };
  }
}

async getTripByFilter(filter = {}) {
  try {
    let query = {};

    if (filter.source) query.source = filter.source;
    if (filter.destination) query.destination = filter.destination;

    if (filter.minPrice || filter.maxPrice) {
      query.price = {};
      if (filter.minPrice) query.price.$gte = Number(filter.minPrice);
      if (filter.maxPrice) query.price.$lte = Number(filter.maxPrice);
    }

    query.isCancelled = false;

    const trips = await Trip.find(query).populate("bus_id").lean();

    let filteredTrips = trips;
    if (filter.seats && Number(filter.seats) > 0) {
      const requiredSeats = Number(filter.seats);
      filteredTrips = trips.filter(trip => trip.available_seats.length >= requiredSeats);
    }

    return {
      status: 200,
      success: true,
      message: "Filtered trips retrieved",
      data: filteredTrips
    };
  } catch (error) {
    return {
      status: 500,
      success: false,
      message: "Error fetching trips",
      error: error.message
    };
  }
}
}

  


export default BaseTripService;
