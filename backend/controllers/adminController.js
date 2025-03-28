import AdminService from "../services/adminService.js";
import { handleError } from "../utils/authUtils.js";
const adminService = new AdminService();


const AdminController = {
    async getAllUsers(req, res) {
        try {
            const response = await adminService.getAllUsers();
            return res.status(response.status).json(response);
        } catch (error) {
            return handleError(res, error, "Error fetching users");
        }
    },

    async getAllOperators(req, res) {
        try {
            const response = await adminService.getAllOperators();
            return res.status(response.status).json(response);
        } catch (error) {
            return handleError(res, error, "Error fetching operators");
        }
    },

    async blockUser(req, res) {
        try {
            const { userId } = req.params;
            const response = await adminService.blockUser(userId);
            return res.status(response.status).json(response);
        } catch (error) {
            return handleError(res, error, `Error blocking user (${userId})`);
        }
    },

    async unblockUser(req, res) {
        try {
            const { userId } = req.params;
            const response = await adminService.unblockUser(userId);
            return res.status(response.status).json(response);
        } catch (error) {
            return handleError(res, error, `Error unblocking user (${userId})`);
        }
    },

    async blockOperator(req, res) {
        try {
            const { operatorId } = req.params;
            const response = await adminService.blockOperator(operatorId);
            return res.status(response.status).json(response);
        } catch (error) {
            return handleError(res, error, `Error blocking operator (${operatorId})`);
        }
    },

    async unblockOperator(req, res) {
        try {
            const { operatorId } = req.params;
            const response = await adminService.unblockOperator(operatorId);
            return res.status(response.status).json(response);
        } catch (error) {
            return handleError(res, error, `Error unblocking operator (${operatorId})`);
        }
    },

    async getOperatorTrips(req, res) {
        try {
            const { operatorId } = req.params;
            const response = await adminService.getOperatorTrips(operatorId);
            return res.status(response.status).json(response);
        } catch (error) {
            return handleError(res, error, `Error retrieving trips for operator (${operatorId})`);
        }
    }
};

export default AdminController;
