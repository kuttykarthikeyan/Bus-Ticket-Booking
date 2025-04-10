import BaseTripService from "./baseTripService.js";

class UserTripService {
    constructor() {
        this.baseTripService = new BaseTripService();
    }

    async getTripById(trip_id) {
        return this.baseTripService.getTripById(trip_id);
    }

    async getAllTrips() {
        return this.baseTripService.getAllTrips();
    }
    async getTripByFilter(Filter)
    {
        return this.baseTripService.getTripByFilter(Filter)
    }

}

export default UserTripService;
