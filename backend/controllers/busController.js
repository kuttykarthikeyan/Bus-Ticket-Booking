import BusService from "../services/busService.js";

const busService = new BusService();

const busController = {
  async createBus(req, res) {
    try {
      const operatorId = req.user._id;
      const busData = req.body;
      const result = await busService.createBus(busData, operatorId);
      return res.status(result.status).json(result);
    } catch (error) {
      return res.status(500).json({ success: false, message: "Error creating bus", error: error.message });
    }
  },

  async updateBus(req, res) {
    try {
      const result = await busService.updateBus(req.params.busId, req.body);
      return res.status(result.status).json(result);
    } catch (error) {
      return res.status(500).json({ success: false, message: "Error updating bus", error: error.message });
    }
  },

  async deleteBus(req, res) {
    try {
      const result = await operatorBbusServiceusService.deleteBus(req.params.busId);
      return res.status(result.status).json(result);
    } catch (error) {
      return res.status(500).json({ success: false, message: "Error deleting bus", error: error.message });
    }
  }
};

export default busController;
