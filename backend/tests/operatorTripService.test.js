import OperatorTripService from "../services/operatorTripService.js";
import Trip from "../models/tripModel.js";
import Operator from "../models/operatorModel.js";
import BaseTripService from "../services/tripServices/baseTripService.js";

jest.mock("../models/tripModel.js");
jest.mock("../models/operatorModel.js");
jest.mock("../services/baseTripService.js");

describe("OperatorTripService", () => {
    let service;

    beforeEach(() => {
        service = new OperatorTripService();
    });

    afterEach(() => {
        jest.clearAllMocks();
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
    });

    describe("cancelTrip", () => {
        it("should return 400 if operator_id is missing", async () => {
            const result = await service.cancelTrip("tripId", null);
            expect(result.status).toBe(400);
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
    });

    describe("updateTrip", () => {
        it("should return 404 if trip not found", async () => {
            Trip.findById.mockResolvedValue(null);
            const result = await service.updateTrip("fake_id", { price: 200 });
            expect(result.status).toBe(404);
        });

        it("should update allowed fields", async () => {
            const trip = { _id: "trip1" };
            const updatedTrip = { ...trip, price: 500 };
            Trip.findById.mockResolvedValue(trip);
            Trip.findByIdAndUpdate.mockResolvedValue(updatedTrip);

            const result = await service.updateTrip("trip1", { price: 500, not_allowed: true });
            expect(result.status).toBe(200);
            expect(result.trip.price).toBe(500);
        });
    });
});
