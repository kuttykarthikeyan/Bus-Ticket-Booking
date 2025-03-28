import mongoose from "mongoose";

const TripSchema = new mongoose.Schema(
  {
    operatorId: { type: mongoose.Schema.Types.ObjectId, ref: "Operator", required: true },
    bus_id: { type: mongoose.Schema.Types.ObjectId, ref: "Bus", required: true },
    source: { type: String, required: true },
    destination: { type: String, required: true },
    departure_time: { type: Date, required: true },
    arrival_time: { type: Date, required: true },
    price: { type: Number, required: true },
    total_seats: { type: Number, required: true },
    available_seats: { type: [String] },  
    booked_seats: { type: [String], default: [] },
    isCancelled: { type: Boolean, default: false }
  },
  { timestamps: true }
);

// ✅ Ensure `booked_seats` is NOT indexed uniquely
TripSchema.index({ booked_seats: 1 }, { unique: false });

const Trip = mongoose.model("Trip", TripSchema);
export default Trip;
