import OperatorTripService from "../services/tripServices/operatorTripService.js";
import TripModel from "../models/tripModel.js";

jest.mock("../models/tripModel.js");

describe("OperatorTripService", () => {
    let operatorTripService;

    beforeEach(() => {
        operatorTripService = new OperatorTripService();
        jest.clearAllMocks();
    });

    test("should create a trip successfully", async () => {
        const tripData = { departure: "City A", destination: "City B", available_seats: 5 };
        const operatorId = "12345";

        const mockTrip = {
            _id: "mockTripId",
            departure: "City A",
            destination: "City B",
            operatorId,
            available_seats: ["S1", "S2", "S3", "S4", "S5"],
            booked_seats: [],
        };

        TripModel.mockImplementation(() => ({
            save: jest.fn().mockResolvedValue(mockTrip),
        }));

        const response = await operatorTripService.createTrip(tripData, operatorId);

        expect(response.status).toBe(201);
        expect(response.success).toBe(true);
        
        
    });

    test("should return error if operatorId is missing", async () => {
        const tripData = { departure: "City A", destination: "City B" };
        const response = await operatorTripService.createTrip(tripData, null);

        expect(response.status).toBe(500);
        expect(response.success).toBe(false);
        expect(response.message).toBe("Operator ID is required");
    });

    test("should handle errors during trip creation", async () => {
        const tripData = { departure: "City A", destination: "City B" };
        const operatorId = "12345";

        TripModel.mockImplementation(() => ({
            save: jest.fn().mockRejectedValue(new Error("Database error")),
        }));

        const response = await operatorTripService.createTrip(tripData, operatorId);

        expect(response.status).toBe(500);
        expect(response.success).toBe(false);
        expect(response.message).toBe("Invalid number of available seats");
        
    });

    test("should update a trip successfully", async () => {
        const tripId = "trip123";
        const tripData = { destination: "Updated City" };

        TripModel.findByIdAndUpdate = jest.fn().mockResolvedValue({
            _id: tripId,
            ...tripData,
        });

        const response = await operatorTripService.updateTrip(tripId, tripData);

        expect(response.status).toBe(200);
        expect(response.success).toBe(true);
        expect(response.message).toBe("Trip updated successfully");
        expect(response.trip).toMatchObject(tripData);
    });

    test("should return error when updating a non-existing trip", async () => {
        const tripId = "trip123";
        TripModel.findByIdAndUpdate = jest.fn().mockResolvedValue(null);

        const response = await operatorTripService.updateTrip(tripId, {});

        expect(response.status).toBe(404);
        expect(response.success).toBe(false);
        expect(response.message).toBe("Trip not found");
    });

    test("should delete a trip successfully", async () => {
        const tripId = "trip123";
        TripModel.findByIdAndDelete = jest.fn().mockResolvedValue({ _id: tripId });

        const response = await operatorTripService.deleteTrip(tripId);

        expect(response.status).toBe(200);
        expect(response.success).toBe(true);
        expect(response.message).toBe("Trip deleted successfully");
    });

    test("should return error when deleting a non-existing trip", async () => {
        const tripId = "trip123";
        TripModel.findByIdAndDelete = jest.fn().mockResolvedValue(null);

        const response = await operatorTripService.deleteTrip(tripId);

        expect(response.status).toBe(404);
        expect(response.success).toBe(false);
        expect(response.message).toBe("Trip not found");
    });

    test("should return  when no trips are found for an operator", async () => {
        const operatorId = "operator123";
        TripModel.find = jest.fn().mockResolvedValue([]);

        const response = await operatorTripService.getOperatorTrips(operatorId);

        expect(response.status).toBe(200);
        expect(response.success).toBe(true);
        // expect(response.message).toBe("Trips not found");
    });
});
