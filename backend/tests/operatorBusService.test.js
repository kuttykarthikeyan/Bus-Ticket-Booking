import mongoose from "mongoose";
import Bus from "../models/busModel.js";
import OperatorBusService from "../services/busService.js";

jest.mock("../models/busModel.js");

describe("OperatorBusService", () => {
  let operatorBusService;

  beforeAll(() => {
    operatorBusService = new OperatorBusService();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  afterAll(async () => {
    await mongoose.disconnect();
  });



  test("should create a bus successfully", async () => {
    const busData = { name: "Luxury Bus", capacity: 50 };
    const operatorId = "123456";

    Bus.mockImplementation(function (data) {
      return {
        ...data,
        _id: "bus123",
        save: jest.fn().mockResolvedValue({ _id: "bus123", ...data }),
      };
    });

    const result = await operatorBusService.createBus(busData, operatorId);

    expect(result.status).toBe(201);
    expect(result.success).toBe(true);
    expect(result.bus).toHaveProperty("name", "Luxury Bus"); 
    expect(result.bus).toHaveProperty("capacity", 50);
    expect(result.bus).toHaveProperty("operatorId", "123456");
  });


  test("should return error when operator ID is missing", async () => {
    const busData = { name: "Luxury Bus", capacity: 50 };

    const result = await operatorBusService.createBus(busData, null);

    expect(result.status).toBe(400);
    expect(result.success).toBe(false);
    expect(result.message).toBe("Operator ID is required");
  });

  test("should update a bus successfully", async () => {
    const busId = "bus123";
    const busData = { name: "Updated Bus", capacity: 55 };

    Bus.findByIdAndUpdate = jest.fn().mockResolvedValue({ _id: busId, ...busData });

    const result = await operatorBusService.updateBus(busId, busData);

    expect(result.status).toBe(200);
    expect(result.success).toBe(true);
    expect(result.bus.name).toBe("Updated Bus");
  });

  test("should return error if bus to update is not found", async () => {
    Bus.findByIdAndUpdate = jest.fn().mockResolvedValue(null);

    const result = await operatorBusService.updateBus("nonexistent", { name: "Test Bus" });

    expect(result.status).toBe(404);
    expect(result.success).toBe(false);
    expect(result.message).toBe("Bus not found");
  });

  test("should delete a bus successfully", async () => {
    Bus.findByIdAndDelete = jest.fn().mockResolvedValue({ _id: "bus123" });

    const result = await operatorBusService.deleteBus("bus123");

    expect(result.status).toBe(200);
    expect(result.success).toBe(true);
    expect(result.message).toBe("Bus deleted successfully");
  });

  test("should return error if bus to delete is not found", async () => {
    Bus.findByIdAndDelete = jest.fn().mockResolvedValue(null);

    const result = await operatorBusService.deleteBus("nonexistent");

    expect(result.status).toBe(404);
    expect(result.success).toBe(false);
    expect(result.message).toBe("Bus not found");
  });
});
