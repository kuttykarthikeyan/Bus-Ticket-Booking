import mongoose from "mongoose";
import Bus from "../models/busModel.js";

class BusService {
    async createBus(busData, operator_id) {
        if (!operator_id) return { status: 400, success: false, message: "Operator ID is required" };

        try {
            const newBus = new Bus({ ...busData, operator_id });
            await newBus.save();
            return { status: 201, success: true, message: "Bus created successfully", bus: newBus };
        } catch (error) {
            return { status: 500, success: false, message: "Error creating bus", error: error.message };
        }
    }

    async updateBus(bus_id, busData) {
        try {
            const updatedBus = await Bus.findByIdAndUpdate(
                bus_id,
                { $set: busData },
                { new: true, runValidators: true }
            );
            if (!updatedBus) return { status: 400, success: false, message: "Bus not found" };
            return { status: 200, success: true, message: "Bus updated successfully", bus: updatedBus };
        } catch (error) {
            return { status: 500, success: false, message: "Error updating bus", error: error.message };
        }
    }

    async deleteBus(bus_id) {
        try {
            const deletedBus = await Bus.findByIdAndDelete(bus_id);
            if (!deletedBus) return { status: 400, success: false, message: "Bus not found" };
            return { status: 200, success: true, message: "Bus deleted successfully" };
        } catch (error) {
            return { status: 500, success: false, message: "Error deleting bus", error: error.message };
        }
    }

    async  getBus(operator_id) {
        try {
          
      
         
          const buses = await Bus.find({ operator_id });
      
          return { status: 200, success: true, message: "Buses retrieved successfully", bus: buses };
        } catch (error) {
          return { status: 500, success: false, message: "Error retrieving buses", error: error.message };
        }
      }
}

export default BusService;
