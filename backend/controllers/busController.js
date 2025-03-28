import BusService from "../services/busService.js";
import { handleError } from "../utils/authUtils.js";

const busService = new BusService();



const BusController = {
  
    async createBus(req, res) {
        try {
            const operatorId = req.user._id;
            const busData = req.body;
            const result = await busService.createBus(busData, operatorId);
            
            return res.status(result.status).json(result);
        } catch (error) {
            return handleError(res, error, "Internal server error while creating bus");
        }
    },

    async updateBus(req, res) {
        try {
            const { busId } = req.params;
            const busData = req.body;
            const result = await busService.updateBus(busId, busData);
            
            return res.status(result.status).json(result);
        } catch (error) {
            return handleError(res, error, "Internal server error while updating bus");
        }
    },

    async deleteBus(req, res) {
        try {
            const { busId } = req.params;
            const result = await busService.deleteBus(busId);
            
            return res.status(result.status).json(result);
        } catch (error) {
            return handleError(res, error, "Internal server error while deleting bus");
        }
    },
};

export default BusController;
