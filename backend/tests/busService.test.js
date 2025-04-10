import BusService from "../services/busService.js";
import Bus from "../models/busModel.js";

jest.mock("../models/busModel.js");

describe("BusService", () => {
    let service;

    beforeEach(() => {
        service = new BusService();
        jest.clearAllMocks();
    });

    describe("createBus", () => {
        it("should return 400 if operator_id is not provided", async () => {
            const result = await service.createBus({ name: "Volvo" }, null);
            expect(result.status).toBe(400);
            expect(result.success).toBe(false);
            expect(result.message).toBe("Operator ID is required");
        });

        it("should create a new bus", async () => {
            const saveMock = jest.fn().mockResolvedValue(true);
            Bus.mockImplementation(() => ({
                save: saveMock
            }));

            const result = await service.createBus({ name: "Volvo" }, "op123");

            expect(Bus).toHaveBeenCalledWith(expect.objectContaining({ name: "Volvo", operator_id: "op123" }));
            expect(saveMock).toHaveBeenCalled();
            expect(result.status).toBe(201);
            expect(result.success).toBe(true);
            expect(result.message).toBe("Bus created successfully");
        });

        it("should handle errors during bus creation", async () => {
            Bus.mockImplementation(() => ({
                save: jest.fn().mockRejectedValue(new Error("DB Error"))
            }));

            const result = await service.createBus({ name: "Volvo" }, "op123");

            expect(result.status).toBe(500);
            expect(result.success).toBe(false);
            expect(result.message).toBe("Error creating bus");
        });
    });

    describe("updateBus", () => {
        it("should update bus successfully", async () => {
            const mockUpdatedBus = { _id: "bus123", name: "Updated Volvo" };
            Bus.findByIdAndUpdate.mockResolvedValue(mockUpdatedBus);

            const result = await service.updateBus("bus123", { name: "Updated Volvo" });

            expect(Bus.findByIdAndUpdate).toHaveBeenCalledWith(
                "bus123",
                { $set: { name: "Updated Volvo" } },
                { new: true, runValidators: true }
            );
            expect(result.status).toBe(200);
            expect(result.success).toBe(true);
        });

        it("should return 400 if bus not found", async () => {
            Bus.findByIdAndUpdate.mockResolvedValue(null);

            const result = await service.updateBus("invalid_id", {});

            expect(result.status).toBe(400);
            expect(result.message).toBe("Bus not found");
        });

        it("should handle errors during bus update", async () => {
            Bus.findByIdAndUpdate.mockRejectedValue(new Error("Update Error"));

            const result = await service.updateBus("bus123", {});

            expect(result.status).toBe(500);
            expect(result.message).toBe("Error updating bus");
        });
    });

    describe("deleteBus", () => {
        it("should delete bus successfully", async () => {
            Bus.findByIdAndDelete.mockResolvedValue({ _id: "bus123" });

            const result = await service.deleteBus("bus123");

            expect(Bus.findByIdAndDelete).toHaveBeenCalledWith("bus123");
            expect(result.status).toBe(200);
            expect(result.success).toBe(true);
        });

        it("should return 400 if bus not found", async () => {
            Bus.findByIdAndDelete.mockResolvedValue(null);

            const result = await service.deleteBus("invalid_id");

            expect(result.status).toBe(400);
            expect(result.message).toBe("Bus not found");
        });

        it("should handle errors during bus deletion", async () => {
            Bus.findByIdAndDelete.mockRejectedValue(new Error("Delete Error"));

            const result = await service.deleteBus("bus123");

            expect(result.status).toBe(500);
            expect(result.message).toBe("Error deleting bus");
        });
    });
});
