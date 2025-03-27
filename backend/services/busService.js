import Bus from "../models/busModel.js";
class BusService  
{
    async createBus(busData, operatorId) {
        if (!operatorId) return { status: 400, success: false, message: "Operator ID is required" };

        try {
            const newBus = new Bus({ ...busData, operatorId });
            await newBus.save();
            return { status: 201, success: true, message: "Bus created successfully", bus: newBus };
        } catch (error) {
            return { status: 500, success: false, message: "Error creating bus", error: error.message };
        }
    }

    async updateBus(busId, busData) {
        try {
            const updatedBus = await Bus.findByIdAndUpdate(busId, busData, { new: true });
            if (!updatedBus) return { status: 404, success: false, message: "Bus not found" };
            return { status: 200, success: true, message: "Bus updated successfully", bus: updatedBus };
        } catch (error) {
            return { status: 500, success: false, message: "Error updating bus", error: error.message };
        }
    }

    async deleteBus(busId) {
        try {
            const deletedBus = await Bus.findByIdAndDelete(busId);
            if (!deletedBus) return { status: 404, success: false, message: "Bus not found" };
            return { status: 200, success: true, message: "Bus deleted successfully" };
        } catch (error) {
            return { status: 500, success: false, message: "Error deleting bus", error: error.message };
        }
    }
}
export default BusService;