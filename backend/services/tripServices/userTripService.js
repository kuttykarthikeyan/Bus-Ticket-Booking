import BaseTripService from "./baseTripService.js";

class UserTripService {
    constructor() {
        this.baseTripService = new BaseTripService();
    }

    async getTripById(tripId) {
        return this.baseTripService.getTripById(tripId);
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
