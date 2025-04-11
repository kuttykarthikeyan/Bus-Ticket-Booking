import BusService from "../services/busService.js";
import { handleError } from "../utils/authUtils.js";
import mongoose from "mongoose";
const busService = new BusService();
class BusController {

  async createBus(req, res) {
    try {
      const operator_id = req.user._id;
      const busData = req.body;

      if (!operator_id) {
        return res.status(400).json({ success: false, message: "Operator ID is required" });
      }

      const result = await busService.createBus(busData, operator_id);
      return res.status(result.status).json(result);
    } catch (error) {
      return handleError(res, error, "Error creating bus");
    }
  }

  async updateBus(req, res) {
    try {
      const { bus_id } = req.params;
      const busData = req.body;

      if (!mongoose.Types.ObjectId.isValid(bus_id)) {
        return res.status(400).json({ success: false, message: "Invalid Bus ID" });
      }

      const result = await busService.updateBus(bus_id, busData);
      return res.status(result.status).json(result);
    } catch (error) {
      return handleError(res, error, "Error updating bus");
    }
  }

  async deleteBus(req, res) {
    try {
      const { bus_id } = req.params;

      if (!mongoose.Types.ObjectId.isValid(bus_id)) {
        return res.status(400).json({ success: false, message: "Invalid Bus ID" });
      }

      const result = await busService.deleteBus(bus_id);
      return res.status(result.status).json(result);
    } catch (error) {
      return handleError(res, error, "Error deleting bus");
    }
  }
  async getBus(req,res)
  {
 
 try
    {  const {_id}=req.user
     const result =await busService.getBus(_id);
     return res.status(result.status).json(result)
}
catch(error)
{
  return handleError(res, error, "Error in retriving  bus");

}
  }
}

export default new BusController();
