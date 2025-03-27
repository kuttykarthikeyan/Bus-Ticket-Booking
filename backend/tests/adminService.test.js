import AdminService from "../services/adminService.js";
import User from "../models/userModel.js";
import Trip from "../models/tripModel.js";

jest.mock("../models/userModel.js");
jest.mock("../models/operatorModel.js");
jest.mock("../models/tripModel.js");

describe("AdminService Unit Tests", () => {
    let adminService;

    beforeEach(() => {
        adminService = new AdminService();
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    test("getAllUsers should return users successfully", async () => {
        const mockUsers = [{ _id: "1", name: "Alice" }, { _id: "2", name: "Bob" }];
        User.find.mockResolvedValue(mockUsers);

        const response = await adminService.getAllUsers();

        expect(response.status).toBe(200);
        expect(response.success).toBe(true);
        expect(response.users).toEqual(mockUsers);
    });

    test("getAllUsers should handle errors", async () => {
        User.find.mockRejectedValue(new Error("Database error"));

        const response = await adminService.getAllUsers();

        expect(response.status).toBe(500);
        expect(response.success).toBe(false);
        expect(response.message).toBe("Error retrieving users");
    });

    test("blockUser should update user status", async () => {
        const mockUser = { _id: "1", name: "Alice", isBlocked: true };
        User.findByIdAndUpdate.mockResolvedValue(mockUser);

        const response = await adminService.blockUser("1");

        expect(response.status).toBe(200);
        expect(response.success).toBe(true);
        expect(response.message).toBe("User blocked successfully");
        expect(response.user).toEqual(mockUser);
    });

    test("unblockUser should update user status", async () => {
        const mockUser = { _id: "1", name: "Alice", isBlocked: false };
        User.findByIdAndUpdate.mockResolvedValue(mockUser);

        const response = await adminService.unblockUser("1");

        expect(response.status).toBe(200);
        expect(response.success).toBe(true);
        expect(response.message).toBe("User unblocked successfully");
        expect(response.user).toEqual(mockUser);
    });

    test("blockUser should handle errors", async () => {
        User.findByIdAndUpdate.mockRejectedValue(new Error("Database error"));

        const response = await adminService.blockUser("1");

        expect(response.status).toBe(500);
        expect(response.success).toBe(false);
        expect(response.message).toBe("Error blocking user");
    });

    test("getOperatorTrips should return trips", async () => {
        const mockTrips = [{ _id: "1", route: "NY to LA" }];
        Trip.find.mockResolvedValue(mockTrips);

        const response = await adminService.getOperatorTrips("123");

        expect(response.status).toBe(200);
        expect(response.success).toBe(true);
        expect(response.message).toBe("Trips retrieved successfully");
        expect(response.trips).toEqual(mockTrips);
    });

    test("getOperatorTrips should handle errors", async () => {
        Trip.find.mockRejectedValue(new Error("Database error"));

        const response = await adminService.getOperatorTrips("123");

        expect(response.status).toBe(500);
        expect(response.success).toBe(false);
        expect(response.message).toBe("Error in getting Operator Trips ");
    });
});
