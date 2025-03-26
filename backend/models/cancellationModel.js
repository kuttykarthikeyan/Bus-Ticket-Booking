import mongoose from "mongoose";

const CancellationSchema = new mongoose.Schema(
  {
    booking_id: { type: mongoose.Schema.Types.ObjectId, ref: "Booking", required: true },
    user_id: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    refund_status: {
      type: String,
      enum: ["pending", "processed", "failed"],
      default: "pending",
    },
    cancellation_reason: { type: String, required: true },
  },
  { timestamps: true }
);

const Cancellation = mongoose.model("Cancellation", CancellationSchema);
export default Cancellation;
