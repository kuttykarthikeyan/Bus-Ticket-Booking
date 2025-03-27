import AdminService from "../services/adminService.js";

const adminService = new AdminService();
const AdminController={

    async getAllUsers(req, res) {
        const response = await adminService.getAllUsers();
        return res.status(response.status).json(response);
    },

    async getAllOperators(req, res) {
        const response = await adminService.getAllOperators();
        return res.status(response.status).json(response);
    },

    async blockUser(req, res) {
        const { userId } = req.params;
        const response = await adminService.blockUser(userId);
        return res.status(response.status).json(response);
    },

    async unblockUser(req, res) {
        const { userId } = req.params;
        const response = await adminService.unblockUser(userId);
        return res.status(response.status).json(response);
    },

    async blockOperator(req, res) {
        const { operatorId } = req.params;
        const response = await adminService.blockOperator(operatorId);
        return res.status(response.status).json(response);
    },

    async unblockOperator(req, res) {
        const { operatorId } = req.params;
        const response = await adminService.unblockOperator(operatorId);
        return res.status(response.status).json(response);
    },
    
    async getOperatorTrips(req, res) {
        try {
            const { operatorId } = req.params;
            const response = await adminService.getOperatorTrips(operatorId);
            return res.status(response.status).json(response);
        } catch (error) {
            return res.status(500).json({ success: false, message: "Error retrieving operator's trips", error: error.message });
        }
    }
}
export default AdminController;