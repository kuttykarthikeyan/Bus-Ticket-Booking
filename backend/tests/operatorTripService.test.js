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
        const tripData = { departure: "City A", destination: "City B" };
        const operatorId = "12345";
    
        const mockTrip = {
            ...tripData,
            operatorId,
            _id: "mockTripId" 
        };
    
        TripModel.mockImplementation(() => ({
            save: jest.fn().mockResolvedValue(mockTrip)
        }));
    
        const response = await operatorTripService.createTrip(tripData, operatorId);
    
        expect(response.success).toBe(true);
        expect(response.message).toBe("Trip created successfully");
      
    });
    
    
    
    test("should return error if operatorId is missing", async () => {
        const tripData = { departure: "City A", destination: "City B" };
        const response = await operatorTripService.createTrip(tripData, null);

        expect(response.status).toBe(400);
        expect(response.success).toBe(false);
        expect(response.message).toBe("Operator ID is required");
    });

    test("should handle errors during trip creation", async () => {
        const tripData = { departure: "City A", destination: "City B" };
        const operatorId = "12345";

        TripModel.mockImplementation(() => ({
            save: jest.fn().mockRejectedValue(new Error("Database error"))
        }));

        const response = await operatorTripService.createTrip(tripData, operatorId);

        expect(response.status).toBe(500);
        expect(response.success).toBe(false);
        expect(response.message).toBe("Error creating trip");
        expect(response.error).toBe("Database error");
    });

    test("should update a trip successfully", async () => {
        const tripId = "trip123";
        const tripData = { destination: "Updated City" };
        
        TripModel.findByIdAndUpdate = jest.fn().mockResolvedValue({
            _id: tripId,
            ...tripData
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

    test("should handle errors when deleting a trip", async () => {
        const tripId = "trip123";
        TripModel.findByIdAndDelete = jest.fn().mockRejectedValue(new Error("Database error"));

        const response = await operatorTripService.deleteTrip(tripId);

        expect(response.status).toBe(500);
        expect(response.success).toBe(false);
        expect(response.message).toBe("Error deleting trip");
        expect(response.error).toBe("Database error");
    });
});
