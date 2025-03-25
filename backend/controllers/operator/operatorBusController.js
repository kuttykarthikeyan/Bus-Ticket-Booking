import OperatorBusService from "../../services/busServices/operatorBusSerive.js";

const operatorBusService = new OperatorBusService();

const operatorBusController = {
  async createBus(req, res) {
    try {
      const operatorId = req.user.operatorId;
      const busData = req.body;
      const result = await operatorBusService.createBus(busData, operatorId);
      return res.status(result.status).json(result);
    } catch (error) {
      return res.status(500).json({ success: false, message: "Error creating bus", error: error.message });
    }
  },

  async updateBus(req, res) {
    try {
      const result = await operatorBusService.updateBus(req.params.busId, req.body);
      return res.status(result.status).json(result);
    } catch (error) {
      return res.status(500).json({ success: false, message: "Error updating bus", error: error.message });
    }
  },

  async deleteBus(req, res) {
    try {
      const result = await operatorBusService.deleteBus(req.params.busId);
      return res.status(result.status).json(result);
    } catch (error) {
      return res.status(500).json({ success: false, message: "Error deleting bus", error: error.message });
    }
  }
};

export default operatorBusController;
