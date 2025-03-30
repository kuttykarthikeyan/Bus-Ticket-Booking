import mongoose from "mongoose";

const BusSchema = new mongoose.Schema(
  {
    operator_id: { type: mongoose.Schema.Types.ObjectId, ref: "Operator", required: true },
    busNumber: { type: String, required: true, unique: true },
    busType: { type: String, required: true },
    totalSeats: { type: Number, required: true },
    amenities: [{ type: String }],
  },
  { timestamps: true }
);

const Bus = mongoose.model("Bus", BusSchema);
export default Bus;
