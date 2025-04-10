import AdminService from "../services/adminService.js";
import { handleError } from "../utils/authUtils.js";

const adminService = new AdminService();

class AdminController {
    static async createTrip(req, res) {
        try {
            const { operatorId } = req.params;
            const response = await adminService.createTrip(req.body, operatorId);
            return res.status(response.status).json(response);
        } catch (error) {
            return handleError(res, error, "Error creating trip");
        }
    }

    static async updateTrip(req, res) {
        try {
            const { tripId } = req.params;
            const response = await adminService.updateTrip(tripId, req.body);
            return res.status(response.status).json(response);
        } catch (error) {
            return handleError(res, error, `Error updating trip (${tripId})`);
        }
    }

    static async deleteTrip(req, res) {
        try {
            const { tripId } = req.params;
            const response = await adminService.deleteTrip(tripId);
            return res.status(response.status).json(response);
        } catch (error) {
            return handleError(res, error, `Error deleting trip (${tripId})`);
        }
    }

    static async getAllTrips(req, res) {
        try {
            const response = await adminService.getAllTrips();
            return res.status(response.status).json(response);
        } catch (error) {
            return handleError(res, error, "Error fetching trips");
        }
    }

    static async getTripById(req, res) {
        try {
            const { tripId } = req.params;
            const response = await adminService.getTripById(tripId);
            return res.status(response.status).json(response);
        } catch (error) {
            return handleError(res, error, `Error retrieving trip (${tripId})`);
        }
    }

    static async cancelTrip(req, res) {
        try {
            const { tripId } = req.params;
            const response = await adminService.cancelTrip(tripId);
            return res.status(response.status).json(response);
        } catch (error) {
            return handleError(res, error, `Error canceling trip (${tripId})`);
        }
    }

    static async getOperatorTrips(req, res) {
        try {
            const { operatorId } = req.params;
            const response = await adminService.getOperatorTrips(operatorId);
            return res.status(response.status).json(response);
        } catch (error) {
            return handleError(res, error, `Error retrieving trips for operator (${operatorId})`);
        }
    }

    // 🔹 User Management

    static async getAllUsers(req, res) {
        try {
            const response = await adminService.getAllUsers();
            return res.status(response.status).json(response);
        } catch (error) {
            return handleError(res, error, "Error fetching users");
        }
    }

    static async blockUser(req, res) {
        try {
            const { userId } = req.params;
            const response = await adminService.blockUser(userId);
            return res.status(response.status).json(response);
        } catch (error) {
            return handleError(res, error, `Error blocking user (${userId})`);
        }
    }

    static async unblockUser(req, res) {
        try {
            const { userId } = req.params;
            const response = await adminService.unblockUser(userId);
            return res.status(response.status).json(response);
        } catch (error) {
            return handleError(res, error, `Error unblocking user (${userId})`);
        }
    }

    static async getAllOperators(req, res) {
        try {
            const response = await adminService.getAllOperators();
            return res.status(response.status).json(response);
        } catch (error) {
            return handleError(res, error, "Error fetching operators");
        }
    }

    static async blockOperator(req, res) {
        try {
            const { operatorId } = req.params;
            const response = await adminService.blockOperator(operatorId);
            return res.status(response.status).json(response);
        } catch (error) {
            return handleError(res, error, `Error blocking operator (${operatorId})`);
        }
    }

    static async unblockOperator(req, res) {
        try {
            const { operatorId } = req.params;
            const response = await adminService.unblockOperator(operatorId);
            return res.status(response.status).json(response);
        } catch (error) {
            return handleError(res, error, `Error unblocking operator (${operatorId})`);
        }
    }
    //Admin analytics
    static async getAnalytics(req,res){
       try{

        const response= await adminService.getAnalytics()
        res.status(response.status).json(response);
       }
       catch(error)
       {
        return handleError(res, error, "Error in  analytics controller ");
       }

    }
}

export default AdminController;
