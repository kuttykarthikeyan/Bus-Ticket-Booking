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

    available_seats: { type: [String], required: true }, 
    booked_seats: { type: [String], default: [] }, 

    seat_locked: [
      {
        seat_number: { type: String, required: true },
        locked_by: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
        locked_at: { type: Date, default: Date.now },
      },
    ],

    isCancelled: { type: Boolean, default: false },
  },
  { timestamps: true }
);

const Trip = mongoose.model("Trip", TripSchema);
export default Trip;
