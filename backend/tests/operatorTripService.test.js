import OperatorTripService from "../services/tripServices/operatorTripService.js";
import BaseTripService from "../services/tripServices/baseTripService.js";
import Trip from "../models/tripModel.js";
import Operator from "../models/operatorModel.js";
import mongoose from "mongoose";

jest.mock("../models/tripModel.js");
jest.mock("../models/operatorModel.js");
jest.mock("../services/tripServices/baseTripService.js");

describe("OperatorTripService", () => {
    let service;
    let mockBaseTripService;

    beforeEach(() => {
        mockBaseTripService = {
            getTripById: jest.fn(),
            getAllTrips: jest.fn(),
            getTripByFilter: jest.fn()
        };
        
        BaseTripService.mockImplementation(() => mockBaseTripService);
        service = new OperatorTripService();
        
        // Mock mongoose.Types.ObjectId.isValid
        mongoose.Types.ObjectId.isValid = jest.fn().mockImplementation(id => 
            typeof id === 'string' && id.length === 24
        );
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    // Test for getTripById
    describe("getTripById", () => {
        it("should delegate to baseTripService.getTripById", async () => {
            const expectedResult = { status: 200, data: { id: "trip123" } };
            mockBaseTripService.getTripById.mockResolvedValue(expectedResult);
            
            const result = await service.getTripById("trip123");
            
            expect(mockBaseTripService.getTripById).toHaveBeenCalledWith("trip123");
            expect(result).toBe(expectedResult);
        });
    });

    // Test for getAllTrips
    describe("getAllTrips", () => {
        it("should delegate to baseTripService.getAllTrips", async () => {
            const expectedResult = { status: 200, data: [{ id: "trip123" }] };
            mockBaseTripService.getAllTrips.mockResolvedValue(expectedResult);
            
            const result = await service.getAllTrips();
            
            expect(mockBaseTripService.getAllTrips).toHaveBeenCalled();
            expect(result).toBe(expectedResult);
        });
    });

    // Test for getTripByFilter
    describe("getTripByFilter", () => {
        it("should delegate to baseTripService.getTripByFilter", async () => {
            const filter = { source: "City A" };
            const expectedResult = { status: 200, data: [{ id: "trip123" }] };
            mockBaseTripService.getTripByFilter.mockResolvedValue(expectedResult);
            
            const result = await service.getTripByFilter(filter);
            
            expect(mockBaseTripService.getTripByFilter).toHaveBeenCalledWith(filter);
            expect(result).toBe(expectedResult);
        });
    });

    describe("createTrip", () => {
        it("should return 400 if operator_id is not provided", async () => {
            const result = await service.createTrip({}, null);
            expect(result.status).toBe(400);
            expect(result.message).toBe("Operator ID is required");
        });

        it("should return 400 if total_seats is invalid", async () => {
            const tripData = { total_seats: 0 };
            const result = await service.createTrip(tripData, "operator123");
            expect(result.status).toBe(400);
            expect(result.message).toBe("Total seats must be greater than 0");
        });

        it("should create a trip and update operator", async () => {
            const tripData = {
                total_seats: 2,
                source: "A",
                destination: "B",
                departure_time: new Date(),
                arrival_time: new Date(),
                price: 100,
                bus_id: "bus123"
            };

            const mockTrip = {
                _id: "trip123",
                save: jest.fn().mockResolvedValue(true)
            };

            Trip.mockImplementation(() => mockTrip);
            Operator.findByIdAndUpdate.mockResolvedValue(true);

            const result = await service.createTrip(tripData, "operator123");

            expect(Trip).toHaveBeenCalledWith(expect.objectContaining({
                operator_id: "operator123",
                total_seats: 2,
                available_seats: [1, 2]
            }));
            expect(mockTrip.save).toHaveBeenCalled();
            expect(Operator.findByIdAndUpdate).toHaveBeenCalledWith(
                "operator123",
                { $push: { trips: mockTrip._id } }
            );
            expect(result.status).toBe(201);
            expect(result.success).toBe(true);
        });
        
        it("should handle errors during trip creation", async () => {
            const tripData = {
                total_seats: 2,
                source: "A",
                destination: "B"
            };
            
            const mockError = new Error("Database error");
            Trip.mockImplementation(() => {
                throw mockError;
            });
            
            const result = await service.createTrip(tripData, "operator123");
            
            expect(result.status).toBe(500);
            expect(result.success).toBe(false);
            expect(result.message).toBe("Error creating trip");
            expect(result.error).toBe(mockError.message);
        });
    });

    describe("cancelTrip", () => {
        it("should return 400 if operator_id is missing", async () => {
            const result = await service.cancelTrip("tripId", null);
            expect(result.status).toBe(400);
        });
        
        it("should return 400 if trip_id is invalid", async () => {
            const result = await service.cancelTrip("invalid_id", "operator123");
            expect(result.status).toBe(400);
            expect(result.message).toBe("Invalid trip ID format");
        });

        it("should return 404 if trip not found", async () => {
            Trip.findOne.mockResolvedValue(null);
            const result = await service.cancelTrip("662a0092557e6a22f85468e1", "operator123");
            expect(result.status).toBe(404);
        });

        it("should cancel the trip", async () => {
            const trip = {
                _id: "trip123",
                isCancelled: false,
                save: jest.fn().mockResolvedValue(true)
            };
            Trip.findOne.mockResolvedValue(trip);

            const result = await service.cancelTrip("662a0092557e6a22f85468e1", "operator123");
            expect(trip.isCancelled).toBe(true);
            expect(trip.save).toHaveBeenCalled();
            expect(result.status).toBe(200);
        });
        
        it("should handle errors during trip cancellation", async () => {
            const mockError = new Error("Database error");
            Trip.findOne.mockImplementation(() => {
                throw mockError;
            });
            
            const result = await service.cancelTrip("662a0092557e6a22f85468e1", "operator123");
            
            expect(result.status).toBe(500);
            expect(result.success).toBe(false);
            expect(result.message).toBe("Error cancelling trip");
            expect(result.error).toBe(mockError.message);
        });
    });

    describe("updateTrip", () => {
        it("should return 400 if trip ID format is invalid", async () => {
            const result = await service.updateTrip("invalid_id", { price: 200 });
            expect(result.status).toBe(400);
            expect(result.message).toBe("Invalid trip ID format");
        });
    
        it("should return 404 if trip not found", async () => {
            Trip.findById.mockResolvedValue(null);
            const result = await service.updateTrip("662a0092557e6a22f85468e1", { price: 200 });
            expect(result.status).toBe(404);
            expect(result.message).toBe("Trip not found");
        });
    
        it("should update allowed fields and ignore others", async () => {
            const trip = { 
                _id: "662a0092557e6a22f85468e1", 
                source: "City A", 
                destination: "City B", 
                price: 300 
            };
            const updatedTrip = { ...trip, price: 500 };
            
            // Mock the find and update methods
            Trip.findById.mockResolvedValue(trip);
            Trip.findByIdAndUpdate.mockResolvedValue(updatedTrip);
    
            const result = await service.updateTrip("662a0092557e6a22f85468e1", { 
                price: 500,
                invalidField: "should be ignored"
            });
    
            expect(Trip.findByIdAndUpdate).toHaveBeenCalledWith(
                "662a0092557e6a22f85468e1", 
                { price: 500 }, 
                { new: true }
            );
            expect(result.status).toBe(200);
            expect(result.success).toBe(true);
            expect(result.trip).toEqual(updatedTrip);
        });
        
        it("should handle errors during trip update", async () => {
            const mockError = new Error("Database error");
            Trip.findById.mockImplementation(() => {
                throw mockError;
            });
            
            const result = await service.updateTrip("662a0092557e6a22f85468e1", { price: 500 });
            
            expect(result.status).toBe(500);
            expect(result.success).toBe(false);
            expect(result.message).toBe("Error updating trip");
            expect(result.error).toBe(mockError.message);
        });
    });
    
    describe("deleteTrip", () => {
        it("should return 400 if trip_id is invalid", async () => {
            const result = await service.deleteTrip("invalid_id", "operator123");
            expect(result.status).toBe(400);
            expect(result.message).toBe("Invalid trip ID or operator ID format");
        });
        
        it("should return 400 if operator_id is invalid", async () => {
            const result = await service.deleteTrip("662a0092557e6a22f85468e1", "invalid_id");
            expect(result.status).toBe(400);
            expect(result.message).toBe("Invalid trip ID or operator ID format");
        });
        
        it("should return 404 if trip not found or doesn't belong to operator", async () => {
            Trip.findOne.mockResolvedValue(null);
            const result = await service.deleteTrip("662a0092557e6a22f85468e1", "662a0092557e6a22f85468e2");
            expect(result.status).toBe(404);
            expect(result.message).toBe("Trip not found or does not belong to this operator");
        });
        
        it("should delete the trip and update operator", async () => {
            const trip = { _id: "662a0092557e6a22f85468e1" };
            Trip.findOne.mockResolvedValue(trip);
            Trip.findByIdAndDelete.mockResolvedValue(true);
            Operator.findByIdAndUpdate.mockResolvedValue(true);
            
            const result = await service.deleteTrip("662a0092557e6a22f85468e1", "662a0092557e6a22f85468e2");
            
            expect(Trip.findByIdAndDelete).toHaveBeenCalledWith("662a0092557e6a22f85468e1");
            expect(Operator.findByIdAndUpdate).toHaveBeenCalledWith(
                "662a0092557e6a22f85468e2",
                { $pull: { trips: "662a0092557e6a22f85468e1" } }
            );
            expect(result.status).toBe(200);
            expect(result.success).toBe(true);
        });
        
        it("should handle errors during trip deletion", async () => {
            const mockError = new Error("Database error");
            Trip.findOne.mockImplementation(() => {
                throw mockError;
            });
            
            const result = await service.deleteTrip("662a0092557e6a22f85468e1", "662a0092557e6a22f85468e2");
            
            expect(result.status).toBe(500);
            expect(result.success).toBe(false);
            expect(result.message).toBe("Error deleting trip");
            expect(result.error).toBe(mockError.message);
        });
    });
    
    describe("getOperatorTrips", () => {
        it("should return 400 if operator_id is invalid", async () => {
            const result = await service.getOperatorTrips("invalid_id");
            expect(result.status).toBe(400);
            expect(result.message).toBe("Invalid operator ID format");
        });
        
        it("should return 404 if no trips found for operator", async () => {
            Trip.find.mockResolvedValue([]);
            const result = await service.getOperatorTrips("662a0092557e6a22f85468e2");
            expect(result.status).toBe(404);
            expect(result.message).toBe("No trips found for this operator");
        });
        
        it("should return trips for the operator", async () => {
            const trips = [
                { _id: "trip1", source: "City A", destination: "City B" },
                { _id: "trip2", source: "City C", destination: "City D" }
            ];
            Trip.find.mockResolvedValue(trips);
            
            const result = await service.getOperatorTrips("662a0092557e6a22f85468e2");
            
            expect(Trip.find).toHaveBeenCalledWith({ operator_id: "662a0092557e6a22f85468e2" });
            expect(result.status).toBe(200);
            expect(result.success).toBe(true);
            expect(result.data).toEqual(trips);
        });
        
        it("should handle errors during trip retrieval", async () => {
            const mockError = new Error("Database error");
            Trip.find.mockImplementation(() => {
                throw mockError;
            });
            
            const result = await service.getOperatorTrips("662a0092557e6a22f85468e2");
            
            expect(result.status).toBe(500);
            expect(result.success).toBe(false);
            expect(result.message).toBe("Error retrieving operator trips");
            expect(result.error).toBe(mockError.message);
        });
    });
});