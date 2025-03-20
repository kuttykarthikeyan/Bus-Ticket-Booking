import mongoose from "mongoose";

const TripSchema = new mongoose.Schema({
  bus_id: { type: mongoose.Schema.Types.ObjectId, ref: "Bus" },
  source: String,
  destination: String,
  departure_time: Date,
  arrival_time: Date,
  price: Number,
  available_seats: Number,
}, { timestamps: true });

export const Trip = mongoose.model("Trip", TripSchema);
