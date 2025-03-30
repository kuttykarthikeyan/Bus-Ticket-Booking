import mongoose from "mongoose";

const BookingSchema = new mongoose.Schema(
  {
    user_id: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    trip_id: { type: mongoose.Schema.Types.ObjectId, ref: "Trip", required: true },
    seat_numbers: [{ type: Number, required: true }], 
    payment_status: { type: String, enum: ["pending", "paid", "failed"], default: "pending" },
    booking_status: { type: String, enum: ["confirmed", "cancelled"], default: "confirmed" },
    cancellation_date: { type: Date }
  },
  { timestamps: true }
);

const Booking = mongoose.model("Booking", BookingSchema);
export default Booking;
